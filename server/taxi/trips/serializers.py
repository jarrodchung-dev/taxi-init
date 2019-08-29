# trips/py

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.serializers import CharField
from rest_framework.serializers import ImageField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import ValidationError
from trips.models import Trip
from urllib.parse import urljoin


class MediaImageField(ImageField):
    """ Allows a user of the application to use photos for profiles """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        if not value:
            return
        return urljoin(settings.MEDIA_URL, value.name)


class UserSerializer(ModelSerializer):
    """
    Serializes user information if Meta fields are valid for the user model
    """

    password1 = CharField(write_only=True)
    password2 = CharField(write_only=True)
    group = CharField()
    photo = MediaImageField(allow_empty_file=True)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        group_data = validated_data.pop("group")
        group, _ = Group.objects.get_or_create(name=group_data)
        data = {
            key: value
            for key, value in validated_data.items()
            if key not in ("password1", "password2")
        }
        data["password"] = validated_data["password1"]
        user = self.Meta.model.objects.create_user(**data)
        user.groups.add(group)
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "password1",
            "password2",
            "first_name",
            "last_name",
            "group",
            "photo",
        )
        read_only_fields = ("id",)


class TripSerializer(ModelSerializer):
    """ Serializes the trip data to pass between the client and the server """

    class Meta:
        model = Trip
        fields = "__all__"
        read_only_fields = ("id", "created", "updated")


class ReadOnlyTripSerializer(ModelSerializer):
    """ Serializes full User object (rather than primary_key only) """

    driver = UserSerializer(read_only=True)
    rider = UserSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = "__all__"
