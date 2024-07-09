from django.urls import path, include
from .views import ProjectListAPIView, ProjectDetailAPIView

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"", ProjectListAPIView, basename="dashboard")
router.register(r"project/", ProjectDetailAPIView, basename="dashboard/prj")
urlpatterns = [
    path('', include(router.urls)),
]
