# taxi/urls.py --confirmed

from django.contrib import admin
from django.urls import include
from django.urls import path
from trips.views import LoginView
from trips.views import LogoutView
from trips.views import SignUpView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/signup/", SignUpView.as_view(), name="signup"),
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/trip/", include("trips.urls", "trip")),
]