from PIL import Image
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from trips.models import Trip
from trips.serializers import TripSerializer
from trips.serializers import UserSerializer


PASSWORD = "nostalgia-ultra"

def create_user(
    username="rider@taxi.com",
    password=PASSWORD,
    group_name="rider"
    ):
    """ Adds user to database for testing. """
    group, _ = Group.objects.get_or_create(name=group_name)
    user = get_user_model().objects.create_user(
        username=username,
        password=password
    )
    user.groups.add(group)
    user.save()
    return user

def create_photo_file():
    data = BytesIO()
    Image.new("RGB", (100, 100)).save(data, "PNG")
    data.seek(0)
    photo_file = SimpleUploadedFile(
        "photo.png",
        data.getvalue()
    )
    return photo_file


class AuthenticationTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

    def test_user_can_sign_up(self):
        """ Asserts API returns 201 status code when user creates account """
        photo_file = create_photo_file()
        response = self.client.post(
            reverse("sign_up"),
            data={
                "username": "test@user.com",
                "first_name": "Test",
                "last_name": "User",
                "password1": PASSWORD,
                "password2": PASSWORD,
                "group": "rider",
                "photo": photo_file,
            }
        )
        user = get_user_model().objects.last()
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(response.data["id"], user.id)
        self.assertEqual(response.data["username"], user.username)
        self.assertEqual(response.data["first_name"], user.first_name)
        self.assertEqual(response.data["last_name"], user.last_name)
        self.assertEqual(response.data["group"], user.group)
        self.assertIsNotNone(user.photo)

    def test_user_can_log_in(self):
        """ Asserts authenticated users can log in. """
        user = create_user()
        response = self.client.post(
            reverse("log_in"),
            data={
                "username": user.username,
                "password": PASSWORD,
            }
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(response.data["username"], user.username)

    def test_user_can_log_out(self):
        """ Asserts authenticated users can log out. """
        user = create_user()
        self.client.login(
            username=user.username,
            password=PASSWORD
        )
        response = self.client.post(reverse("log_out"))
        self.assertEqual(status.HTTP_204_NO_CONTENT, response.status_code)



class HttpTripTest(APITestCase):

    def setUp(self):
        self.user = create_user()
        self.client = APIClient()
        self.client.login(
            username=self.user.username,
            password=PASSWORD
        )

    def test_user_can_list_trips(self):
        """ Asserts user can retrieve available trip data as a list. """
        trips = [
            Trip.objects.create(
                pick_up_address="A",
                drop_off_address="B",
                rider=self.user
            ),
            Trip.objects.create(
                pick_up_address="B",
                drop_off_address="C",
                rider=self.user
            ),
            Trip.objects.create(
                pick_up_address="C",
                drop_off_address="D"
            )
        ]
        response = self.client.get(reverse("trip:trip_list"))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        exp_trip_ids = [str(trip.id) for trip in trips[0:2]]
        act_trip_ids = [trip.get("id") for trip in response.data]
        self.assertCountEqual(exp_trip_ids, act_trip_ids)

    def test_user_can_retrieve_trip_by_id(self):
        """
        Asserts user can get trip by ID using Trip model's get_absolute_url.
        """
        trip = Trip.objects.create(
            pick_up_address="A",
            drop_off_address="B",
            rider=self.user
        )
        response = self.client.get(trip.get_absolute_url())
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(str(trip.id), response.data.get("id"))
