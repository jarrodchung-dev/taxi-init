from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from trips.models import Trip
from trips.models import User


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    """ Creates the admin panel. """
    pass


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    fields = (
        "id",
        "pick_up_address",
        "drop_off_address",
        "status",
        "created",
        "updated",
        "rider",
        "driver",
    )
    list_display = (
        "id",
        "pick_up_address",
        "drop_off_address",
        "status",
        "created",
        "updated",
        "rider",
        "driver",
    )
    list_filter = (
       "status",
    )
    readonly_fields = (
        "id",
        "created",
        "updated",
    )