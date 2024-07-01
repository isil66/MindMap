from django.urls import path
from .views import UserList, UserRegistrationAPIView

from . import views

urlpatterns = [
    path("", UserList.as_view(), name="index"),
    path("/register", UserRegistrationAPIView.as_view(), name="register"),
]
