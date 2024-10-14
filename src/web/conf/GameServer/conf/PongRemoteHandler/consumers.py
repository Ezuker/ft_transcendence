import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging
from MatchMakingHandler.models import Game
from Connect4Handler.models import UserProxy
from asgiref.sync import sync_to_async
from .serializer import GameSerializer
from channels.layers import get_channel_layer

logger = logging.getLogger('print')

class PongRemoteGame:
    def __init__(self, player1=None, player2=None):
        self.players = [player1, player2]
        self.game = None
        self.gameInstance = None
    
    def __str__(self):
        return f"{self.players[0]} vs {self.players[1]}"

class PongRemoteHandler(AsyncWebsocketConsumer):
    games = {}

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        self.games = {}

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
                player1 = self.games[game_uuid].players[0]
                player2 = self.games[game_uuid].players[1]
                if (player1 is not None) and (player2 is not None):
                    self.games[game_uuid].game = Game(player1=player1, player2=player2)
                    self.games[game_uuid].gameInstance = GamePong(player1, player2, self)
                    await self.games[game_uuid].gameInstance.start_game()
        elif text_data_json['type'] == 'move':
            direction = text_data_json['direction']
            isKeyDown = text_data_json['isKeyDown']
            player = text_data_json['player']
            game_uuid = text_data_json['game_uuid'] 
            if game_uuid in self.games:
                self.games[game_uuid].gameInstance.move_paddle(player, direction, isKeyDown)
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
        game_id = event['game_id']
        player1 = event['player1']
        player2 = event['player2']

        logger.info(f"Sending game_joined message to group: {self.room_group_name}")
        logger.info(f"Game joined: {game_id} - {player1} - {player2}")
        # Once both players have joined, create the game object
        if (player1 is not None) and (player2 is not None):
            await self.send(text_data=json.dumps({
                'type': 'game_joined',
                'game_id': game_id,
                'player1': player1,
                'player2': player2,
            }))

    async def game_move(self, event):
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

    async def game_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_started',
            'player1': event['player1'],
            'player2': event['player2'],
            'ball': event['ball'],
            'player1_paddle': event['player1_paddle'],
            'player2_paddle': event['player2_paddle']
        }))
    
    async def update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update',
            'player1_paddle': event['player1_paddle'],
            'player2_paddle': event['player2_paddle']
        }))

    async def update_ball(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_ball',
            'ball': event['ball']
        }))

import threading
import time
import asyncio

class GamePong:
    def __init__(self, player1, player2, parent):
        self.width = 800
        self.height = 600
        self.parent = parent
        self.player1 = player1
        self.player2 = player2
        self.player1_score = 0
        self.player2_score = 0
        self.player1_paddle = self.height / 2
        self.player2_paddle = self.height / 2
        self.player1_up = False
        self.player1_down = False
        self.player2_up = False
        self.player2_down = False
        self.ball = {
            'x': self.width / 2,
            'y': self.height / 2,
            'dx': 1,
            'dy': 1
        }  
        self.game_over = False

    async def start_game(self):
        logger.info(f"Game started: {self.player1} vs {self.player2}")
        await self.parent.channel_layer.group_send(
            self.parent.room_group_name,
            {
                'type': 'game_started',
                'player1': self.player1,
                'player2': self.player2,
                'ball': self.ball,
                'player1_paddle': self.player1_paddle,
                'player2_paddle': self.player2_paddle
            }
        )
    
        asyncio.create_task(self.run_game())

    async def run_game(self):
        while not self.game_over:
            await self.update_paddles()
            await self.update_game_state()
            await self.send_update()  
            await asyncio.sleep(1 / 60)


    async def send_update(self):
        await self.parent.channel_layer.group_send(
            self.parent.room_group_name,
            {
                'type': 'update',
                'ball': self.ball,
                'player1_paddle': self.player1_paddle,
                'player2_paddle': self.player2_paddle,
            }
        )
    
    async def update_paddles(self):
        if self.player1_up and self.player1_paddle > 0:
            self.player1_paddle -= 7
            if self.player1_paddle < 0:
                self.player1_paddle = 0
        if self.player1_down and self.player1_paddle < self.height - 100:
            self.player1_paddle += 7
            if self.player1_paddle > self.height - 100:
                self.player1_paddle = self.height - 100
        if self.player2_up and self.player2_paddle > 0:
            self.player2_paddle -= 7
            if self.player2_paddle < 0:
                self.player2_paddle = 0
        if self.player2_down and self.player2_paddle < self.height - 100:
            self.player2_paddle += 7
            if self.player2_paddle > self.height - 100:
                self.player2_paddle = self.height - 100
        if self.player1_down or self.player1_up or self.player2_down or self.player2_up:
            await self.parent.channel_layer.group_send(
                self.parent.room_group_name,
                {
                    'type': 'update',
                    'player1_paddle': self.player1_paddle,
                    'player2_paddle': self.player2_paddle
                }
            )

    def move_paddle(self, player, direction, isKeyDown):
        if player == self.player1:
            if direction == 'up':
                self.player1_up = isKeyDown
            elif direction == 'down':
                self.player1_down = isKeyDown
        elif player == self.player2:
            if direction == 'up':
                self.player2_up = isKeyDown
            elif direction == 'down':
                self.player2_down = isKeyDown

    def print_game_state(self):
        logger.info(f"Player 1: {self.player1_score}")
        logger.info(f"Player 2: {self.player2_score}")
        logger.info(f"Ball: {self.ball}")
        logger.info(f"Player 1 paddle: {self.player1_paddle}")
        logger.info(f"Player 2 paddle: {self.player2_paddle}")

    async def send_ball(self):
        await self.parent.channel_layer.group_send(
            self.parent.room_group_name,
            {
                'type': 'update_ball',
                'ball': self.ball
            }
        )

    async def update_game_state(self):
        self.ball['x'] += self.ball['dx']
        self.ball['y'] += self.ball['dy']

        if self.ball['x'] <= 15 or self.ball['x'] >= self.width - 15:
            self.ball['dx'] *= -1
            logger.info(f"BALL COLLISION: {self.ball}")
            await self.send_ball()
        if self.ball['y'] <= 15 or self.ball['y'] >= self.height - 15:
            self.ball['dy'] *= -1
            logger.info(f"BALL COLLISION: {self.ball}")
            await self.send_ball()
        # check if the ball is colliding with the paddles
        # if self.ball['x'] <= 15 and self.player1_paddle <= self.ball['y'] <= self.player1_paddle:
        #     self.ball['dx'] *= -1
        #     logger.info(f"BALL COLLISION WITH PADDLE: {self.ball}")
        #     await self.send_ball()
        # if self.ball['x'] >= self.width - 15 and self.player2_paddle <= self.ball['y'] <= self.player2_paddle:
        #     self.ball['dx'] *= -1
        #     logger.info(f"BALL COLLISION WITH PADDLE: {self.ball}")
        #     await self.send_ball()
        # check if the ball is out of bounds
        # if self.ball['x'] <= 0:
        #     self.player2_scored()
        # if self.ball['x'] >= self.width:
        #     self.player1_scored()
        
    def reset_round(self):
        # Pause the game for a few seconds
        self.ball = {
            'x': self.width / 2,
            'y': self.height / 2,
            'dx': 10,
            'dy': 1
        }
        time.sleep(3)

    def player1_scored(self):
        self.player1_score += 1
        if self.player1_score == 5:
            self.game_over = True

    def player2_scored(self):
        self.player2_score += 1
        if self.player2_score == 5:
            self.game_over = True