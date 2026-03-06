from rest_framework import serializers
from game.models import Player, Room, WordCard


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "name", "team", "role", "room", "created_at"]


class WordCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordCard
        fields = ["id", "word", "color", "revealed", "position"]


class RoomSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["id", "code", "created_at", "host", "game_state", "turn", "status", "players"]
