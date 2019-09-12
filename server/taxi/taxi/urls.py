from django.conf import settings
from django.conf import settings
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include
from django.urls import path
from trips.views import LogInView
from trips.views import LogOutView
from trips.views import SignUpView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/sign_up/", SignUpView.as_view(), name="sign_up"),
    path("api/log_in/", LogInView.as_view(), name="log_in"),
    path("api/log_out/", LogOutView.as_view(), name="log_out"),
    path("api/trip/", include("trips.urls", "trip",)),
]