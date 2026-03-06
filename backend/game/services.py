import random
import string
import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from game.models import Room, WordCard
from game.word_bank import WORDS

logger = logging.getLogger(__name__)


def generate_room_code(length: int = 6) -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choice(chars) for _ in range(length))


def unique_room_code() -> str:
    while True:
        code = generate_room_code()
        if not Room.objects.filter(code=code).exists():
            return code


def create_board(room: Room) -> None:
    WordCard.objects.filter(room=room).delete()
    selected_words = random.sample(WORDS, 25)
    colors = ["red"] * 9 + ["blue"] * 8 + ["neutral"] * 7 + ["assassin"]
    random.shuffle(colors)

    cards = [
        WordCard(
            room=room,
            word=selected_words[index],
            color=colors[index],
            revealed=False,
            position=index,
        )
        for index in range(25)
    ]
    WordCard.objects.bulk_create(cards)


def room_remaining(room: Room) -> dict:
    cards = room.cards.all()
    red_left = cards.filter(color="red", revealed=False).count()
    blue_left = cards.filter(color="blue", revealed=False).count()
    return {
        "red": red_left,
        "blue": blue_left,
    }


def safe_cards_for_player(room: Room, role: str, team: str):
    cards = room.cards.order_by("position")
    payload = []
    for card in cards:
        show_color = card.revealed or role == "spymaster"
        payload.append(
            {
                "id": card.id,
                "word": card.word,
                "color": card.color if show_color else "hidden",
                "real_color": card.color,
                "revealed": card.revealed,
                "position": card.position,
            }
        )
    return payload


def broadcast_room_event(room_code: str, event: str, payload: dict) -> None:
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    try:
        async_to_sync(channel_layer.group_send)(
            f"room_{room_code}",
            {
                "type": "room.event",
                "event": event,
                "payload": payload,
            },
        )
    except Exception as exc:
        logger.warning("Broadcast skipped for room %s (%s): %s", room_code, event, exc)
