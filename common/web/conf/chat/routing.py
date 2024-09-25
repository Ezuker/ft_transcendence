from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/lobby/(?P<room_name>\w+)/$', consumers.LobbyConsumer.as_asgi()),
    re_path(r'ws/social/(?P<room_name>\w+)/$', consumers.SocialConsumer.as_asgi()),
    re_path(r'ws/notif/(?P<room_name>\w+)/$', consumers.NotifConsumer.as_asgi()),
]