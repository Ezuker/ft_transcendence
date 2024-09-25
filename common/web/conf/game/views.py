from django.shortcuts import render, redirect
from api.models import Game, Lobby, Player, Game_Tournament, Tournament, GameInvitation
import logging

logger = logging.getLogger('print')

from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FormParser
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout as auth_logout
import requests
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Case, IntegerField, Sum, When
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.conf import settings
from api.login_required import login_required, not_login_required
from django.core.exceptions import ObjectDoesNotExist


# =============================================================================

@login_required
def joinGame(request):
    try:
        currentPlayer = request.user.player
        lobby_id = request.GET.get('lobby_id', 'default_value')
        lobby = Lobby.objects.get(UUID=lobby_id)
        tournament = Tournament.objects.get(UUID_LOBBY=lobby)
        tournament_games = tournament.games.all()
        for game in tournament_games:
            if game.players.filter(id=currentPlayer.id).exists() :
                game_id = game.id

        return HttpResponse("Player is not in any of the tournament's games. Proceed with joining logic.")
    except Lobby.DoesNotExist:
        return HttpResponse("Lobby does not exist.")
    except Tournament.DoesNotExist:
        return HttpResponse("Tournament does not exist for the given lobby.")
    except Exception as e:
        return HttpResponse(f"An error occurred: {str(e)}")

@login_required
def ranked(request):
    if (request.htmx):
        return render(request, "ranked/ranked.html")
    return render(request, "ranked/ranked_full.html")

@login_required
def connect4(request):
    if request.htmx:
        return render(request, "connect4/connect4.html")
    return render(request, "connect4/connect4_full.html")

@login_required
def pong3D(request):
	if request.htmx:
		return render(request, "pong3D/pong3D.html")
	return render(request, "pong3D/pong3D_full.html")

@login_required
def gameHome(request):
    if (request.htmx):
        return render(request, "home/home.html")
    return render(request, "home/home_full.html")

# view valide

@login_required
def pongLocal(request):
    if request.htmx:
        return render(request, "pongLocal/pongLocal.html")
    return render(request, "pongLocal/pongLocal_full.html")

@login_required
def pongCustom(request):
    if request.htmx:
        return render(request, "pongCustom/pongCustom.html")
    return render(request, "pongCustom/pongCustom_full.html")

@login_required
def pongPrivGame(request):
    # user = request.user
    # player = Player.objects.get(username=user.username)
    # opponentId = request.GET.get('opponent', 'default_value')
    # opponent = Player.objects.get(id=opponentId)

    invitGame = GameInvitation.objects.filter(player1=player, player2=opponent)
    if not invitGame:
        invitGame = GameInvitation.objects.filter(player1=opponent, player2=player)
    if not invitGame:
        return render(request, "pongPrivGame/pongPrivGame.html", {"error": "Game not found"})
    player.img = player.img.name.startswith('profile_pics/') and '/media/' + player.img.name or player.img
    opponent.img = opponent.img.name.startswith('profile_pics/') and '/media/' + opponent.img.name or opponent.img
    privGame = Game.objects.get(UUID=invitGame[0].game_id.UUID)
    data = {
        'player' : {
            'id': player.id,
            'username': player.username,
            'img': player.img,
        },
        'opponent' : {
            'id': opponent.id,
            'username': opponent.username,
            'img': opponent.img,
        },
        'game': {
            'id': privGame.UUID,
            'type': privGame.type,
            'finish': privGame.finish,
            'p1Id': privGame.player1.id,
            'p2Id' : privGame.player2.id,
        }
    }
    return render(request, "pongPrivGame/pongPrivGame.html", data)

@login_required
def pongTournament(request):
    if request.htmx:
        return render(request, "pongTournament/pongTournament.html")
    return render(request, "pongTournament/pongTournament_full.html")

@login_required
def pongTournamentLobby(request):
    try:
        playerId = request.user.username
        playerId = Player.objects.get(username=playerId).id
        lobby_id = request.GET.get('lobby_id', 'default_value')
        lobby = Lobby.objects.get(UUID=lobby_id)
        players = lobby.players.all()
        for player in players:
            if hasattr(player, 'img') and player.img:
                img_path = str(player.img)
                if img_path.startswith('profile_pics/'):
                    player.img = '/media/' + img_path
        ia_players = lobby.ai_players.all()
        if request.htmx:
            return render(request, "pongTournament/pongTournamentLobby.html", {"lobby": lobby, "players": players, "ia_players": ia_players, 'userId': playerId})
        return render(request, "pongTournament/pongTournamentLobby_full.html", {"lobby": lobby, "players": players, "ia_players": ia_players, 'userId': playerId})
    except Lobby.DoesNotExist:
        if request.htmx:
            return render(request, "pongTournament/pongTournament.html", {"error": "Lobby not found"})
        return render(request, "pongTournament/pongTournament_full.html", {"error": "Lobby not found"})
    except Exception as e:
        if request.htmx:
            return render(request, "pongTournament/pongTournament.html", {"error": "An unexpected error occurred"})
        return render(request, "pongTournament/pongTournament_full.html", {"error": "An unexpected error occurred"})

@login_required
def pongTournamentGame(request):
    try:
        user = request.user
        player = Player.objects.get(username=user.username)
        lobbyUUID = request.GET.get('lobby_id', 'default_value')
        tournament = Tournament.objects.get(UUID_LOBBY=lobbyUUID)
        games = Game_Tournament.objects.filter(UUID_TOURNAMENT=tournament)

        gameId = -1
        for game in games:
            if game.players.filter(id=player.id).exists() or game.ai_players.filter(id=player.id).exists():
                if game.winner_player is None and game.winner_ai is None:
                    gameId = game.id
                    break
        
        if gameId == -1:
            return render(request, "pongTournament/pongTournament_full.html", {"error": "Game not found"})
        

        game = Game_Tournament.objects.get(id=gameId)
        participantsPlayer = game.players.all()
        participantsAI = game.ai_players.all()
        participants = []
        for player in participantsPlayer:
            participants.append({
                'id': player.id,
                'username': player.username,
                'img': player.img
            })
        for player in participantsAI:
            participants.append({
                'id': player.id,
                'username': 'ia',
                'img': 'ia'
            })

        return render(request, "pongTournament/pongTournamentGame.html", {'userId': 0, 'game': game, 'participants': participants})
    except Exception as e:
        return render(request, "pongTournament/pongTournament.html", {"error": "Game not found"})