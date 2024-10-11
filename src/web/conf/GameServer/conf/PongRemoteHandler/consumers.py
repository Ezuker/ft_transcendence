import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging
from MatchMakingHandler.models import Game
from Connect4Handler.models import UserProxy
from asgiref.sync import sync_to_async
from .serializer import GameSerializer

logger = logging.getLogger('print')

class PongRemoteGame:
    def __init__(self, player1=None, player2=None):
        self.players = [player1, player2]
        self.game = None
    
    def __str__(self):
        return f"{self.players[0]} vs {self.players[1]}"

class PongRemoteHandler(AsyncWebsocketConsumer):
    games = {}

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        logger.info(f"Received message: {text_data_json}")

        if text_data_json['type'] == 'create':
            # "Fake" game creation just to get a game_uuid and send to the front to redirect the first player
            game_uuid = str(uuid.uuid4())
            await self.send(text_data=json.dumps({
                'type': 'game_created',
                'game_uuid': game_uuid,
            }))

        elif text_data_json['type'] == 'join':
            game_uuid = text_data_json['game_uuid']
            if game_uuid not in self.games:
                # Here's the real game creation if it doesn't exist
                self.games[game_uuid] = PongRemoteGame()

            self.room_group_name = f"game_{game_uuid}"
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            if self.games[game_uuid].players[0] is None:
                # Add the first player (the one who created the game)
                self.games[game_uuid].players[0] = text_data_json['player']
                await self.send(text_data=json.dumps({
                    'type': 'waiting_for_opponent',
                    'game_uuid': game_uuid
                }))
            else:
                if self.games[game_uuid].players[0] == text_data_json['player']:
                    # handle F5 refresh
                    return
                # If the game already has a player, add the second player and send the game_joined message for both players to start the game
                self.games[game_uuid].players[1] = text_data_json['player']
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_joined',
                        'game_id': game_uuid,
                        'player1': self.games[game_uuid].players[0],
                        'player2': self.games[game_uuid].players[1]
                    }
                )
        elif text_data_json['type'] == 'move':
            direction = text_data_json['direction']
            isKeyDown = text_data_json['isKeyDown']
            player = text_data_json['player']
            game_uuid = text_data_json['game_uuid']
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_move',
                    'game_id': game_uuid,
                    'player': player,
                    'direction': direction,
                    'isKeyDown': isKeyDown
                }
            )

    async def game_joined(self, event):
        """
        Handles the event when a game is joined.

        This method is triggered when a player joins a game. It logs the event and sends a message to the group with the game details.
        This function will lauch the game for both players.
        Args:
            event (dict): A dictionary containing the event data.
                - game_id (str): The ID of the game.
                - player1 (str): The name or ID of the first player.
                - player2 (str): The name or ID of the second player.

        Returns:
            None
        """
        game_id = event['game_id']
        player1 = event['player1']
        player2 = event['player2']

        logger.info(f"Sending game_joined message to group: {self.room_group_name}")
        logger.info(f"Game joined: {game_id} - {player1} - {player2}")
        # Once both players have joined, create the game object
        if (player1 is not None) and (player2 is not None):
            self.games[game_id].game = Game(player1=player1, player2=player2)
        await self.send(text_data=json.dumps({
            'type': 'game_joined',
            'game_id': game_id,
            'player1': player1,
            'player2': player2,
        }))

    async def game_move(self, event):
        """
        Handles the event when a player makes a move.

        This method is triggered when a player makes a move in a game. It logs the event and sends a message to the group with the move details.
        Args:
            event (dict): A dictionary containing the event data.
                - game_id (str): The ID of the game.
                - player (str): The name or ID of the player who made the move.
                - direction (str): The direction of the move.
                - isKeyDown (bool): Whether the key is down or not.

        Returns:
            None
        """
        game_id = event['game_id']
        player = event['player']
        direction = event['direction']
        isKeyDown = event['isKeyDown']

        logger.info(f"Sending game_move message to group: {self.room_group_name}")
        logger.info(f"Game move: {game_id} - {player} - {direction} - {isKeyDown}")
        await self.send(text_data=json.dumps({
            'type': 'game_move',
            'player': player,
            'direction': direction,
            'isKeyDown': isKeyDown
        }))