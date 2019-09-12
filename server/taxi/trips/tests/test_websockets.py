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

TEST_CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

@database_sync_to_async
def create_trip(**kwargs):
    return Trip.objects.create(**kwargs)

@database_sync_to_async
def create_user(*, username="rider@taxi.com", password="rider", group="rider"):
    user = get_user_model().objects.create_user(username=username,
                                                password=password)
    user_group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(user_group)
    user.save()
    return user

async def connect_and_create_trip(*,
                                  user,
                                  pick_up_address="A",
                                  drop_off_address="B"):
    """ Connects user and creates trip. """
    communicator = await auth_connect(user)
    await communicator.send_json_to({
        "type": "create.trip",
        "data": {
            "pick_up_address": pick_up_address,
            "drop_off_address": drop_off_address,
            "rider": user.id,
        }
    })
    return communicator

async def connect_and_update_trip(*, user, trip, status):
    """ Updates existing trips. """
    communicator = await auth_connect(user)
    await communicator.send_json_to({
        "type": "update.trip",
        "data": {
            "id": f"{trip.id}",
            "pick_up_address": trip.pick_up_address,
            "drop_off_address": trip.drop_off_address,
            "status": status,
            "driver": user.id
        }
    })
    return communicator

async def auth_connect(user):
    """
    Forces authentication to get sesion ID and passes session ID to server
    for user authentication.
    """
    # Forces authentication to get session ID
    client = Client()
    client.force_login(user=user)
    # Passes session ID to authenticate user
    communicator = WebsocketCommunicator(
        application=application,
        path="/taxi/",
        headers=[(
            b"cookie",
            f"sessionid={client.cookies['sessionid'].value}".encode("ascii")
        )]
    )
    connected, _ = await communicator.connect()
    assert_true(connected)
    return communicator



@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestWebsockets:
    """
    Utilizes asycio's coroutines and pytest to treat tests as asynchronous
    coroutines.
    `transaction=True`: ensures database flushes between tests
    """

    async def test_authorized_user_can_connect(self, settings):
        """ Asserts authorized users can connect to server. """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user = await create_user(username="rider@taxi.com", group="rider")
        communicator = await auth_connect(user)
        await communicator.disconnect()


    async def test_rider_can_create_trips(self, settings):
        """
        Establishes authenticated WebSockets connection, sends JSON-encoded
        message to server, creates new trip and returns response to client.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(username="rider@taxi.com", group="rider")
        communicator = await connect_and_create_trip(user=user)

        # Recieves JSON from server
        response = await communicator.receive_json_from()
        data = response.get("data")

        # Confirms data from server
        assert_is_not_none(data["id"])
        assert_equal("A", data["pick_up_address"])
        assert_equal("B", data["drop_off_address"])
        assert_equal(Trip.REQUESTED, data["status"])
        assert_is_none(data["driver"])
        assert_equal(user.username, data["rider"].get("username"))

        await communicator.disconnect()

    async def test_rider_is_added_to_trip_group_on_create(self, settings):
        """
        Asserts once rider has created trip, rider is added to group and
        receives trip updates.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(username="rider@taxi.com", group="rider")
        # Connects and sends JSON to server
        communicator = await connect_and_create_trip(user=user)
        # Receives JSON from server; rider should be added to trip group
        response = await communicator.receive_json_from()
        data = response.get("data")
        trip_id = data["id"]
        message = {
            "type": "echo.message",
            "data": "This is a test message."
        }

        # Sends JSON to new trip group
        channel_layer = get_channel_layer()
        await channel_layer.group_send(trip_id, message=message)

        # Recieves JSON from server
        response = await communicator.receive_json_from()

        # Confirms data
        assert_equal(message, response)

        await communicator.disconnect()


    async def test_rider_is_added_to_trip_group_on_connect(self, settings):
        """
        Connects to server, retrieves trips for rider and adds rider to
        trip's group.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        user = await create_user(
            username="passenger@taxi.com",
            group="rider"
        )
        trip = await create_trip(
            pick_up_address="A",
            drop_off_address="B",
            rider=user
        )
        communicator = await auth_connect(user)
        message = {
            "type": "echo.message",
            "data": "This is a test message."
        }
        channel_layer = get_channel_layer()
        # Sends test message to trip group
        await channel_layer.group_send(f"{trip.id}", message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)

        await communicator.disconnect()

    async def test_driver_can_update_trip(self, settings):
        """
        Updates existing trip status from REQUESTED to IN_PROGRESS, sends
        request to server to update trip, and confirms response data matches.
        """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        trip = await create_trip(
            pick_up_address="A",
            drop_off_address="B"
        )
        user = await create_user(
            username="driver@taxi.com",
            group="driver"
        )
        communicator = await connect_and_update_trip(
            user=user,
            trip=trip,
            status=Trip.IN_PROGRESS
        )
        response = await communicator.receive_json_from()
        data = response.get("data")

        assert_equal(str(trip.id), data["id"])
        assert_equal("A", data["pick_up_address"])
        assert_equal("B", data["drop_off_address"])
        assert_equal(Trip.IN_PROGRESS, data["status"])
        assert_equal(user.username, data["driver"].get("username"))
        assert_equal(None, data["rider"])

        await communicator.disconnect()

    async def test_driver_is_added_to_trip_group_on_update(self, settings):
        """ Asserts driver is added to trip group on update. """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

        trip = await create_trip(
            pick_up_address="A",
            drop_off_address="B"
        )
        user = await create_user(
            username="driver@taxi.com",
            group="driver"
        )
        communicator = await connect_and_update_trip(
            user=user,
            trip=trip,
            status=Trip.IN_PROGRESS
        )
        response = await communicator.receive_json_from()
        data = response.get("data")
        trip_id = data["id"]
        message = {
            "type": "echo.message",
            "data": "This is a test message."
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(trip_id, message=message)

        response = await communicator.receive_json_from()
        assert_equal(message, response)

        await communicator.disconnect()

    async def test_driver_is_alerted_on_trip_create(self, settings):
        """ Asserts drivers are alerted when new trip is created. """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group="drivers",
            channel="test_channel"
        )
        user = await create_user(
            username="rider@taxi.com",
            group="rider"
        )

        communicator = await connect_and_create_trip(user=user)

        response = await channel_layer.receive("test_channel")
        data = response.get("data")

        assert_is_not_none(data["id"])
        assert_equal(user.username, data["rider"].get("username"))

        await communicator.disconnect()

    async def test_rider_is_alerted_on_trip_update(self, settings):
        """ Asserts riders should be alerted when driver updates trips. """
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        trip = await create_trip(
            pick_up_address="A",
            drop_off_address="B"
        )
        channel_layer = get_channel_layer()
        await channel_layer.group_add(
            group=f"{trip.id}",
            channel="test_channel"
        )
        user = await create_user(
            username="rider@taxi.com",
            group="driver"
        )
        communicator = await connect_and_update_trip(
            user=user,
            trip=trip,
            status=Trip.IN_PROGRESS
        )
        response = await channel_layer.receive("test_channel")
        data = response.get("data")

        assert_equal(f"{trip.id}", data["id"])
        assert_equal(user.username, data["driver"].get("username"))

        await communicator.disconnect()