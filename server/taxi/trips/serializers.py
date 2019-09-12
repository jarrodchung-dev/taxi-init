from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from trips.models import Trip
from urllib.parse import urljoin


class MediaImageField(serializers.ImageField):
    """ """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        """ Returns user photo, if exists. """
        if not value:
            return None

        return urljoin(
            settings.MEDIA_URL,
            value.name
        )


class UserSerializer(serializers.ModelSerializer):
    """ Serializes User model. """
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    group = serializers.CharField()
    photo = MediaImageField(allow_empty_file=True)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        group_data = validated_data.pop("group")
        group, _ = Group.objects.get_or_create(name=group_data)
        data = {
            key: value for key, value in validated_data.items()
            if key not in ("password1", "password2")
        }
        data["password"] = validated_data["password1"]
        user = self.Meta.model.objects.create_user(**data)
        user.groups.add(group)
        user.save()
        return user

    class Meta:
        """ UserSerializer Meta class. """
        model = get_user_model()
        fields = (
            "id",
            "username",
            "password1",
            "password2",
            "first_name",
            "last_name",
            "group",
            "photo"
        )
        read_only_fields = ("id",)


class TripSerializer(serializers.ModelSerializer):
    """ Seralizes trip data. """

    class Meta:
        """ TripSerializer Meta class. """
        model = Trip
        fields = "__all__"
        # Ensures server (not serializer) updates trip information
        read_only_fields = ("id", "created", "updated")


class ReadOnlyTripSerializer(serializers.ModelSerializer):
    """ Serializes full User object, as opposed to only the primary key. """
    driver = UserSerializer(read_only=True)
    rider = UserSerializer(read_only=True)

    class Meta:
        """ ReadOnlyTripSerializer Meta class. """
        model = Trip
        fields = "__all__"