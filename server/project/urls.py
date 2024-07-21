from django.urls import path, include
from .views import ProjectAPIView, PageView, NoteView, ProjectPagesNotesViewSet

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"page/notes", NoteView, basename="notes")
router.register(r"overview", ProjectPagesNotesViewSet, basename='overview')
router.register(r"page", PageView, basename="page")
router.register(r"", ProjectAPIView, basename="dashboard")

urlpatterns = [
    path('', include(router.urls)),
]
