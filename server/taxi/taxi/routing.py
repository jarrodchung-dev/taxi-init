from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter
from django.urls import path
from trips.consumers import TaxiConsumer

"""
Declares all WebSockets requests pass through AuthMiddlewareStack, which
processes cookies and handles session authentication.
"""

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("taxi/", TaxiConsumer),
        ])
    )
})