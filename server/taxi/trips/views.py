# trips/views.py

from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from trips.models import Trip
from trips.serializers import ReadOnlyTripSerializer
from trips.serializers import UserSerializer


class SignUpView(CreateAPIView):
    """
    Class that creates a Sign-Up View that extends Django REST Framework"s
    CreateAPIView class leveraging UserSerializer class to register a new user.
    """

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    """
    Class that creates a Log-In View that extends Django REST Framework"s
    APIView class leveraging the AuthenticationForm class to validate user
    credentials.
    """

    def post(self, request):
        form = AuthenticationForm(data=request.data)
        if form.is_valid():
            user = form.get_user()
            login(request, user=form.get_user())
            return Response(UserSerializer(user).data)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Class that create a Log-Out view that extends Django REST Framework"s
    APIView class, returning an 204 status code (No Content) when the user
    has logged out successfully.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, *args, **kwargs):
        logout(self.request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TripView(ReadOnlyModelViewSet):
    """
    Class that creates a view of avaialble trips leveraging Django REST
    Framework"s ReadOnlyModelViewSet to support the trip list and trip
    detail views. A user needs to be authenticated in order to access the API.
    """

    lookup_field = "id"
    lookup_url_kwarg = "trip_id"
    permission_classes = (IsAuthenticated,)
    serializer_class = ReadOnlyTripSerializer

    def get_queryset(self):
        user = self.request.user
        if user.group == "driver":
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == "rider":
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()