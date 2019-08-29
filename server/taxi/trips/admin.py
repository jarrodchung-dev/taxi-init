# trips/admin.py

from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from trips.models import Trip
from trips.models import User


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    """ Class registering user admin """
    pass


@admin.register(Trip)
class TripAdmin(ModelAdmin):
    """ Class registering trip admin """

    fields = (
        "id",
        "pickup_address",
        "dropoff_address",
        "status",
        "driver",
        "rider",
        "created",
        "updated",
    )
    list_display = (
        "id",
        "pickup_address",
        "dropoff_address",
        "status",
        "driver",
        "rider",
        "created",
        "updated",
    )
    list_filter = ("status",)
    readonly_fields = ("id", "created", "updated")


# The existing Trip model was epanded in order to link a driver and a rider to
# the same trip. Remember: Drivers and riders are just normal users that belong
# to different user groups and each a give a unique experience.
