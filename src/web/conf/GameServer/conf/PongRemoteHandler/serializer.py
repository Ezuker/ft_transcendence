# SERIALIZER FOR THE GAME

import json
from rest_framework import serializers
from MatchMakingHandler.models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['game_uuid', 'player1', 'player2']
