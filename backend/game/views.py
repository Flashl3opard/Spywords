from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from game.models import Player, Room, WordCard
from game.serializers import PlayerSerializer, RoomSerializer
from game.services import broadcast_room_event, create_board, room_remaining, safe_cards_for_player, unique_room_code


class CreateRoomView(APIView):
    def post(self, request):
        name = (request.data.get("name") or "").strip()
        if not name:
            return Response({"detail": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.create(code=unique_room_code(), host=name)
        player = Player.objects.create(name=name, room=room)

        return Response(
            {
                "room": RoomSerializer(room).data,
                "player": PlayerSerializer(player).data,
            },
            status=status.HTTP_201_CREATED,
        )


class JoinRoomView(APIView):
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        name = (request.data.get("name") or "").strip()
        if not code or not name:
            return Response({"detail": "code and name are required"}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.filter(code=code).first()
        if not room:
            return Response({"detail": "room not found"}, status=status.HTTP_404_NOT_FOUND)
        if Player.objects.filter(room=room, name=name).exists():
            return Response({"detail": "name already taken in this room"}, status=status.HTTP_400_BAD_REQUEST)

        player = Player.objects.create(name=name, room=room)

        payload = {
            "player": PlayerSerializer(player).data,
            "players": PlayerSerializer(room.players.order_by("created_at"), many=True).data,
        }
        broadcast_room_event(room.code, "player_joined", payload)
        return Response({"room": RoomSerializer(room).data, "player": PlayerSerializer(player).data}, status=status.HTTP_201_CREATED)


class RoomStateView(APIView):
    def get(self, request):
        code = (request.query_params.get("code") or "").strip().upper()
        player_id = request.query_params.get("player_id")
        if not code or not player_id:
            return Response({"detail": "code and player_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        room = Room.objects.filter(code=code).first()
        if not room:
            return Response({"detail": "room not found"}, status=status.HTTP_404_NOT_FOUND)

        player = Player.objects.filter(id=player_id, room=room).first()
        if not player:
            return Response({"detail": "player not found"}, status=status.HTTP_404_NOT_FOUND)

        state = room.game_state or {}
        return Response(
            {
                "room": RoomSerializer(room).data,
                "players": PlayerSerializer(room.players.order_by("created_at"), many=True).data,
                "cards": safe_cards_for_player(room, player.role, player.team),
                "remaining": room_remaining(room),
                "clue": state.get("clue"),
                "guesses_left": state.get("guesses_left"),
                "winner": state.get("winner"),
                "chat": state.get("chat", []),
                "reactions": state.get("reactions", []),
            }
        )


class SetTeamView(APIView):
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        team = request.data.get("team")
        if team not in ["red", "blue", "spectator"]:
            return Response({"detail": "invalid team"}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)
        player.team = team
        player.save(update_fields=["team"])

        payload = {"players": PlayerSerializer(room.players.order_by("created_at"), many=True).data}
        broadcast_room_event(room.code, "team_changed", payload)
        return Response(payload)


class SetRoleView(APIView):
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        role = request.data.get("role")
        if role not in ["spymaster", "operative"]:
            return Response({"detail": "invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        if role == "spymaster" and player.team in ["red", "blue"]:
            has_spymaster = room.players.filter(team=player.team, role="spymaster").exclude(id=player.id).exists()
            if has_spymaster:
                return Response({"detail": "team already has a spymaster"}, status=status.HTTP_400_BAD_REQUEST)

        player.role = role
        player.save(update_fields=["role"])

        payload = {"players": PlayerSerializer(room.players.order_by("created_at"), many=True).data}
        broadcast_room_event(room.code, "role_changed", payload)
        return Response(payload)


class StartGameView(APIView):
    @transaction.atomic
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        if player.name != room.host:
            return Response({"detail": "only host can start"}, status=status.HTTP_403_FORBIDDEN)

        teams = room.players.filter(team__in=["red", "blue"])
        if not teams.exists():
            return Response({"detail": "need players in teams"}, status=status.HTTP_400_BAD_REQUEST)

        red_spymaster = room.players.filter(team="red", role="spymaster").exists()
        blue_spymaster = room.players.filter(team="blue", role="spymaster").exists()
        if not red_spymaster or not blue_spymaster:
            return Response({"detail": "both teams need a spymaster"}, status=status.HTTP_400_BAD_REQUEST)

        create_board(room)
        room.status = "active"
        room.turn = "red"
        room.game_state = {
            "clue": None,
            "guesses_left": 0,
            "winner": None,
            "chat": room.game_state.get("chat", []) if room.game_state else [],
            "reactions": [],
        }
        room.save(update_fields=["status", "turn", "game_state"])

        payload = {
            "room": RoomSerializer(room).data,
            "remaining": room_remaining(room),
        }
        broadcast_room_event(room.code, "game_started", payload)
        return Response(payload)


class SubmitClueView(APIView):
    @transaction.atomic
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        clue_word = (request.data.get("clue_word") or "").strip().lower()
        clue_number = request.data.get("clue_number")

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        if room.status != "active":
            return Response({"detail": "game is not active"}, status=status.HTTP_400_BAD_REQUEST)
        if player.role != "spymaster" or player.team != room.turn:
            return Response({"detail": "only current team spymaster can clue"}, status=status.HTTP_403_FORBIDDEN)
        if not clue_word or not isinstance(clue_number, int) or clue_number < 1:
            return Response({"detail": "invalid clue"}, status=status.HTTP_400_BAD_REQUEST)

        room.game_state = {
            **room.game_state,
            "clue": {
                "word": clue_word,
                "number": clue_number,
                "team": player.team,
                "by": player.name,
            },
            "guesses_left": clue_number + 1,
        }
        room.save(update_fields=["game_state"])

        payload = {"clue": room.game_state["clue"], "guesses_left": room.game_state["guesses_left"]}
        broadcast_room_event(room.code, "clue_given", payload)
        return Response(payload)


class GuessWordView(APIView):
    @transaction.atomic
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        card_id = request.data.get("card_id")

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)
        card = get_object_or_404(WordCard, id=card_id, room=room)

        if room.status != "active":
            return Response({"detail": "game is not active"}, status=status.HTTP_400_BAD_REQUEST)
        if player.role != "operative":
            return Response({"detail": "only operatives can guess"}, status=status.HTTP_403_FORBIDDEN)
        if player.team != room.turn:
            return Response({"detail": "not your turn"}, status=status.HTTP_403_FORBIDDEN)
        if card.revealed:
            return Response({"detail": "word already revealed"}, status=status.HTTP_400_BAD_REQUEST)

        state = room.game_state or {}
        if not state.get("clue"):
            return Response({"detail": "no clue submitted"}, status=status.HTTP_400_BAD_REQUEST)

        card.revealed = True
        card.save(update_fields=["revealed"])

        end_turn = False
        winner = None

        if card.color == "assassin":
            room.status = "finished"
            winner = "blue" if room.turn == "red" else "red"
        elif card.color == "neutral":
            end_turn = True
        elif card.color != room.turn:
            end_turn = True

        remaining = room_remaining(room)
        if remaining["red"] == 0:
            room.status = "finished"
            winner = "red"
        elif remaining["blue"] == 0:
            room.status = "finished"
            winner = "blue"

        guesses_left = max((state.get("guesses_left") or 0) - 1, 0)
        if card.color != room.turn:
            guesses_left = 0

        next_turn = room.turn
        if room.status != "finished":
            if end_turn or guesses_left == 0:
                next_turn = "blue" if room.turn == "red" else "red"
                state["clue"] = None
                guesses_left = 0
            room.turn = next_turn

        state["guesses_left"] = guesses_left
        state["winner"] = winner
        room.game_state = state
        room.save(update_fields=["turn", "status", "game_state"])

        payload = {
            "card_id": card.id,
            "word": card.word,
            "color": card.color,
            "revealed": card.revealed,
            "remaining": remaining,
            "turn": room.turn,
            "guesses_left": guesses_left,
            "winner": winner,
            "status": room.status,
        }
        broadcast_room_event(room.code, "word_guessed", payload)

        if room.status == "finished":
            broadcast_room_event(room.code, "game_over", {"winner": winner, "remaining": remaining})
        elif end_turn or guesses_left == 0:
            broadcast_room_event(room.code, "turn_changed", {"turn": room.turn})

        return Response(payload)


class EndTurnView(APIView):
    @transaction.atomic
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        if room.status != "active":
            return Response({"detail": "game is not active"}, status=status.HTTP_400_BAD_REQUEST)
        if player.role != "operative" or player.team != room.turn:
            return Response({"detail": "not allowed"}, status=status.HTTP_403_FORBIDDEN)

        room.turn = "blue" if room.turn == "red" else "red"
        room.game_state = {**room.game_state, "clue": None, "guesses_left": 0}
        room.save(update_fields=["turn", "game_state"])

        payload = {"turn": room.turn}
        broadcast_room_event(room.code, "turn_changed", payload)
        return Response(payload)


class RestartGameView(APIView):
    @transaction.atomic
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        if player.name != room.host:
            return Response({"detail": "only host can restart"}, status=status.HTTP_403_FORBIDDEN)

        create_board(room)
        room.status = "active"
        room.turn = "red"
        room.game_state = {**room.game_state, "clue": None, "guesses_left": 0, "winner": None, "reactions": []}
        room.save(update_fields=["status", "turn", "game_state"])

        payload = {"room": RoomSerializer(room).data, "remaining": room_remaining(room)}
        broadcast_room_event(room.code, "game_started", payload)
        return Response(payload)


class ChatMessageView(APIView):
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        message = (request.data.get("message") or "").strip()

        if not message:
            return Response({"detail": "message is required"}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)

        state = room.game_state or {}
        chat = state.get("chat", [])
        chat.append({"by": player.name, "message": message})
        state["chat"] = chat[-100:]
        room.game_state = state
        room.save(update_fields=["game_state"])

        payload = {"by": player.name, "message": message}
        broadcast_room_event(room.code, "chat_message", payload)
        return Response(payload)


class EmojiReactionView(APIView):
    def post(self, request):
        code = (request.data.get("code") or "").strip().upper()
        player_id = request.data.get("player_id")
        emoji = (request.data.get("emoji") or "").strip()
        if not emoji:
            return Response({"detail": "emoji is required"}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, code=code)
        player = get_object_or_404(Player, id=player_id, room=room)
        payload = {"by": player.name, "emoji": emoji}
        broadcast_room_event(room.code, "reaction", payload)
        return Response(payload)
