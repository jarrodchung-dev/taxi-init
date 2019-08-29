# tests/websockets.py

import pytest

from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import Client
from nose.tools import assert_equal
from nose.tools import assert_is_none
from nose.tools import assert_is_not_none
from nose.tools import assert_true
from taxi.routing import application
from trips.models import Trip


# overwrites application settings to user the InMemoryChannelLayer instead of
# configured RedisChannelLayer
TEST_CHANNEL_LAYERS = {
    "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
}


@database_sync_to_async
def create_user(
    *, username="test@rider.com", password="test_password", group="rider"
):
    """ Creates a test user """
    # Create user
    user = get_user_model().objects.create_user(
        username=username, password=password
    )
    # Create user group
    user_group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(user_group)
    user.save()
    return user


async def auth_connect(user):
    """
    Connects user client and forces client to login as an authenitcated
    user with a cookied and session ID
    """
    client = Client()
    client.force_login(user=user)
    communicator = WebsocketCommunicator(
        application=application,
        path="/taxi/",
        headers=[
            (
                b"cookie",
                f'sessionid={client.cookies["sessionid"].value}'.encode(
                    "ascii"
                ),
            )
        ],
    )
    connected, _ = await communicator.connect()
    assert_true(connected)
    return communicator


async def connect_and_create_trip(
    *, user, pickup_address="home", dropoff_address="work"
):
    """ Helper function to connect to the server and create a trip """
    communicator = await auth_connect(user)
    await communicator.send_json_to(
        {
            "type": "create.trip",
            "data": {
                "pickup_address": pickup_address,
                "dropoff_address": dropoff_address,
                "rider": user.id,
            },
        }
    )
    return communicator


async def connect_and_update_trip(*, user, trip, status):
    """
    Handle updating existing trips and add reusability to updating trip
    information to the server
    """
    communicator = await auth_connect(user)
    await communicator.send_json_to(
        {
            "type": "update.trip",
            "data": {
                "id": f"{trip.id}",
                "pickup_address": trip.pickup_address,
                "dropoff_address": trip.dropoff_address,
                "status": status,
                "driver": user.id,
            },
        }
    )
    return communicator


@database_sync_to_async
def create_trip(**kwargs):
    return Trip.objects.create(**kwargs)


@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebSockets(object):
    async def test_authorized_user_can_connect(self, settings):
        """
        Tests that an authorized user can connect to the server successfully
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user = await create_user(username="test@rider.com", group="rider")
        communicator = await auth_connect(user)
        await communicator.disconnect()

    async def test_rider_can_create_trips(self, settings):
        """
        Tests that the rider can create trips with pickup and dropoff
        destinations
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(username="test@user.com", group="rider")
        communicator = await connect_and_create_trip(user=user)

        response = await communicator.receive_json_from()
        data = response.get("data")

        assert_is_not_none(data["id"])
        assert_equal("home", data["pickup_address"])
        assert_equal("work", data["dropoff_address"])
        assert_equal(Trip.REQUESTED, data["status"])
        assert_is_none(data["driver"])
        assert_equal(user.username, data["rider"].get("username"))

        await communicator.disconnect()

    async def test_rider_is_added_to_trip_group_on_create(self, settings):
        """
        Tests that once a rider creates a trip, rider is added to a group to
        receieve updates about the trip by accessing that group and sends
        a message to it using the `group_send()` method.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(username="rider@example.com", group="rider")
        communicator = await connect_and_create_trip(user=user)
        response = await communicator.receive_json_from()

        data = response.get("data")
        trip_id = data["id"]
        message = {"type": "echo.message", "data": "This is a test message."}

        channel_layer = get_channel_layer()
        await channel_layer.group_send(trip_id, message=message)

        response = await communicator.receive_json_from()
        assert_equal(message, response)

        await communicator.disconnect()

    async def test_rider_is_added_to_trip_groups_on_connect(self, settings):
        """
        Tests that a rider is added to trip group when connected to server and
        receives appropriate response message from the server
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user = await create_user(username="rider3@example.com", group="rider")
        # Create a trip and link the rider to the trip
        trip = await create_trip(
            pickup_address="home", dropoff_address="work", rider=user
        )
        # Connect to server and get trip data for the rider
        communicator = await auth_connect(user)
        message = {"type": "echo.message", "data": "This is a test message."}
        channel_layer = get_channel_layer()
        # Send a JSON message to the trip group
        await channel_layer.group_send(f"{trip.id}", message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)

        await communicator.disconnect()

    async def test_driver_can_update_trips(self, settings):
        """
        Tests that driver can update existing trip status to the server when the
        status of the ride changes.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        trip = await create_trip(pickup_address="home", dropoff_address="work")
        user = await create_user(username="test@driver.com", group="driver")
        # Send JSON message to server
        communicator = await connect_and_update_trip(
            user=user, trip=trip, status=Trip.IN_PROGRESS
        )
        # Receive JSON mssage from server
        response = await communicator.receive_json_from()
        data = response.get("data")
        # Confirm data is valid
        assert_equal(str(trip.id), data["id"])
        assert_equal("home", data["pickup_address"])
        assert_equal("work", data["dropoff_address"])
        assert_equal(Trip.IN_PROGRESS, data["status"])
        assert_equal(user.username, data["driver"].get("username"))
        assert_equal(None, data["rider"])

        await communicator.disconnect()

    async def test_driver_is_added_to_trip_group_on_update(self, settings):
        """
        Tests that driver receives a notification of any updates that occur
        on the trip; this test does not require any changes to the consumer
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        trip = await create_trip(pickup_address="home", dropoff_address="work")
        user = await create_user(username="test@driver.com", group="driver")
        # Send JSON message to server
        communicator = await connect_and_update_trip(
            user=user, trip=trip, status=Trip.IN_PROGRESS
        )
        # Receive JSON message from server
        response = await communicator.receive_json_from()
        data = response.get("data")
        trip_id = data["id"]
        message = {"type": "echo.message", "data": "Test message."}
        # Send JSON message to trip's group
        channel_layer = get_channel_layer()
        await channel_layer.group_send(trip_id, message=message)
        # Receive JSON message from server
        response = await communicator.receive_json_from()
        # Confirm data is valid
        assert_equal(message, response)

        await communicator.disconnect()

    async def test_driver_is_alerted_on_trip_create(self, settings):
        """
        Tests that a driver is alerted when a new trip is created by a rider by
        listening into the test channel and sending a JSON message to the server
        with the user's id and username.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        # Listen to the test channel where group == driver
        channel_layer = get_channel_layer()
        await channel_layer.group_add(group="drivers", channel="test_channel")
        user = await create_user(username="test@rider.com", group="rider")
        # Send JSON message to the server
        communicator = await connect_and_create_trip(user=user)
        # Receive JSON message from the server over the test channel
        response = await channel_layer.receive("test_channel")
        data = response.get("data")
        # Confirm data is valid
        assert_is_not_none(data["id"])
        assert_equal(user.username, data["rider"].get("username"))

        await communicator.disconnect()

    async def test_rider_is_alerted_on_trip_update(self, settings):
        """
        Tests that a rider is alerted when there trip information is update to
        the server
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        trip = await create_trip(pickup_address="home", dropoff_address="work")
        # Listen to the test channel's trip group
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group=f"{trip.id}", channel="test_channel"
        )
        user = await create_user(username="test@driver.com", group="driver")
        # Sends JSON message to server that trip is in progress
        communicator = await connect_and_update_trip(
            user=user, trip=trip, status=Trip.IN_PROGRESS
        )
        # Receive JSON message from server on test channel
        response = await channel_layer.receive("test_channel")
        data = response.get("data")
        assert_equal(f"{trip.id}", data["id"])
        assert_equal(user.username, data["driver"].get("username"))

        await communicator.disconnect()
