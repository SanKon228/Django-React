import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("comments", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("comments", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        comment = text_data_json['comment']

        await self.channel_layer.group_send(
            "comments",
            {
                'type': 'comment_message',
                'comment': comment
            }
        )

    async def comment_message(self, event):
        comment = event['comment']

        await self.send(text_data=json.dumps({
            'comment': comment
        }))
