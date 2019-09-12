from django.contrib.auth import get_user_model
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Q
from rest_framework import generics
from rest_framework import permissions
from rest_framework import status
from rest_framework import views
from rest_framework import viewsets
from rest_framework.response import Response
from trips.models import Trip
from trips.serializers import ReadOnlyTripSerializer
from trips.serializers import UserSerializer


class SignUpView(generics.CreateAPIView):
    """
    Creates sign up view extending Django REST Framework's CreateAPIView,
    leverageing the UserSerializer to create a new user.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LogInView(views.APIView):
    """ Creates log in form view for authenticated users. """

    def post(self, request):
        form = AuthenticationForm(data=request.data)
        if form.is_valid():
            user = form.get_user()
            login(request, user=form.get_user())
            return Response(UserSerializer(user).data)
        else:
            return Response(
                form.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class LogOutView(views.APIView):
    """ Creates log out form view for authenticated users. """
    permissions_class = (permissions.IsAuthenticated, )

    def post(self, *args, **kwargs):
        logout(self.request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TripView(viewsets.ReadOnlyModelViewSet):
    """ Supports trip list and trip detail views. """
    # tells view to get trip record by id value
    lookup_field = "id"
    # named parameter to extract id value from URL
    lookup_url_kwarg = "trip_id"
    permission_classes = (permissions.IsAuthenticated, )
    queryset = Trip.objects.all()
    serializer_class = ReadOnlyTripSerializer

    def get_queryset(self):
        """ Adds proper filters to the TripView model. """
        user = self.request.user
        if user.group == "driver":
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == "rider":
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()
