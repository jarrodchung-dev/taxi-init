# trips/py

import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.db.models import DO_NOTHING
from django.db.models import DateTimeField
from django.db.models import ForeignKey
from django.db.models import ImageField
from django.db.models import Model
from django.db.models import UUIDField
from django.shortcuts import reverse


class User(AbstractUser):
    """
    User class that uses Django's AbstractUser class to give the User model
    custom configurations.
    """

    photo = ImageField(upload_to="photos", null=True, blank=True)

    @property
    def group(self):
        groups = self.groups.all()
        return groups[0].name if groups else None


class Trip(Model):
    """
    Class represeting a trip, or the transportation between a starting location
    (pick-up address) and a destination (drop-off address). At any given point
    in time,a trip can be in a sepcific state, represented by requested,
    started, in progress, or completed.
    """

    REQUESTED = "REQUESTED"
    STARTED = "STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    STATUSES = (
        (REQUESTED, REQUESTED),
        (STARTED, STARTED),
        (IN_PROGRESS, IN_PROGRESS),
        (COMPLETED, COMPLETED),
    )

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = DateTimeField(auto_now_add=True)
    updated = DateTimeField(auto_now=True)
    pickup_address = CharField(max_length=255)
    dropoff_address = CharField(max_length=255)
    status = CharField(max_length=20, choices=STATUSES, default=REQUESTED)
    driver = ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=DO_NOTHING,
        related_name="trips_as_driver",
    )
    rider = ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=DO_NOTHING,
        related_name="trips_as_rider",
    )

    def __str__(self):
        return f"{self.id}"

    def get_absolute_url(self):
        return reverse("trip:trip_detail", kwargs={"trip_id": self.id})
