from django.urls import path
from .views import UserListAPIView, UserRegistrationAPIView

from . import views

urlpatterns = [
    path("", UserListAPIView.as_view(), name="index"),
    path("register/", UserRegistrationAPIView.as_view(), name="register"),
]
