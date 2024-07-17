from django.urls import path, include
from .views import ProjectAPIView, PageView, NoteView

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"page/notes", NoteView, basename="notes")
router.register(r"page", PageView, basename="page")
router.register(r"", ProjectAPIView, basename="dashboard")

urlpatterns = [
    path('', include(router.urls)),
]
