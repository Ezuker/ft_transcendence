# routing.py
from django.urls import re_path, path
from . import consumers

# Websocket URL patterns
# Regex pattern for the URL route
websocket_urlpatterns = [
    re_path(r'^wss-game/pong-ai/$', consumers.PongAIConsumer.as_asgi()),
]