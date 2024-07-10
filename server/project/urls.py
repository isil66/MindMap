from django.urls import path, include
from .views import ProjectAPIView,PageView

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"", ProjectAPIView, basename="dashboard")
router.register(r"page", PageView, basename="page")

urlpatterns = [
    path('', include(router.urls)),
]
