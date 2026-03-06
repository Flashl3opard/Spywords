import json
from channels.generic.websocket import AsyncWebsocketConsumer


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope["url_route"]["kwargs"]["room_code"].upper()
        self.group_name = f"room_{self.room_code}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        data = json.loads(text_data)
        if data.get("type") == "ping":
            await self.send(text_data=json.dumps({"type": "pong"}))

    async def room_event(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "event": event.get("event"),
                    "payload": event.get("payload", {}),
                }
            )
        )
