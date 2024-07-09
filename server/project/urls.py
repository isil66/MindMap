from django.urls import path, include
from .views import ProjectAPIView

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"", ProjectAPIView, basename="dashboard")

urlpatterns = [
    path('', include(router.urls)),
]
