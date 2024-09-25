from typing import Any
from django.db import models
from django.contrib.auth.models import User
import requests
from django.core.exceptions import ValidationError
import uuid


# Create your models here.

class Player(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    mail = models.CharField(max_length=255, unique=True)
    img = models.ImageField(default='profile_pics/default.png', upload_to='profile_pics/')
    created_at = models.DateTimeField(auto_now_add=True)
    eloPong = models.PositiveIntegerField(default=1000)
    eloConnect4 = models.PositiveIntegerField(default=1000)
    is_online = models.BooleanField(default=False)
    lastConnexion = models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self):
        return f"Player(id={self.id}, username={self.username}, eloPong={self.eloPong}, eloConnect4={self.eloConnect4})"

class AIPlayer(models.Model):
    id = models.AutoField(primary_key=True)
    elo = models.PositiveIntegerField(default=1000)
    created_at = models.DateTimeField(auto_now_add=True)

class Friends(models.Model):
    id = models.AutoField(primary_key=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player')
    friend = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='friend')
    status = models.IntegerField(default=0)

class Messages(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='receiver')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Game(models.Model):
    UUID = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)
    type = models.CharField(max_length=10)
    finish = models.BooleanField(default=False)
    time = models.IntegerField(default=0)
    winner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='winner', null=True)
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2')
    elo_before_player1 = models.IntegerField()
    elo_before_player2 = models.IntegerField()
    elo_after_player1 = models.IntegerField(null=True) 
    elo_after_player2 = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GameInvitation(models.Model):
    id = models.AutoField(primary_key=True)
    game_id = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='game')
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player1_invitations')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player2_invitations')
    status = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='notif_sender')
    type = models.IntegerField()
    recipient = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='notif_recipient')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Lobby(models.Model):
    UUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('Player', related_name='owner', null=True, blank=True, on_delete=models.SET_NULL)
    players = models.ManyToManyField('Player', related_name='lobbies')
    ai_players = models.ManyToManyField('AIPlayer', related_name='lobbies', blank=True)
    locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255, unique=False, null=False, default='Lobby')

    def lock(self):
        self.locked = True
        self.save()

class Game_Tournament(models.Model):
    id = models.AutoField(primary_key=True)
    UUID_TOURNAMENT = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='tournament')
    players = models.ManyToManyField('Player', related_name='games')
    ai_players = models.ManyToManyField('AIPlayer', related_name='games')
    winner_player = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='won_games', null=True, blank=True)
    winner_ai = models.ForeignKey('AIPlayer', on_delete=models.CASCADE, related_name='won_games', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    next_game = models.ForeignKey('Game_Tournament', on_delete=models.CASCADE, related_name='previous_game', null=True, blank=True)
    layer = models.IntegerField(default=0)

class Tournament(models.Model):
    UUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    UUID_LOBBY = models.ForeignKey('Lobby', on_delete=models.CASCADE, related_name='lobby')
    created_at = models.DateTimeField(auto_now_add=True)
    games = models.ManyToManyField('Game_Tournament', related_name='tournament')