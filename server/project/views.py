from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import ProjectSerializer, ProjectCreateSerializer
from .models import DocumentProject
from django.utils import timezone
from .permissions import IsOwner


class ProjectAPIView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = DocumentProject.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        return DocumentProject.objects.filter(owner=user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # to not modify original data
        print("data printing: ", data)
        data['owner'] = request.user.id
        serializer = ProjectCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


