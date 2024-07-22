from django.urls import path
from .views import LoginAPIView, UserRegistrationAPIView

urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("register/", UserRegistrationAPIView.as_view(), name="register"),
]
