from django.urls import path
from .views import LoginAPIView, UserRegistrationAPIView

from . import views

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("register/", UserRegistrationAPIView.as_view(), name="register"),
]
