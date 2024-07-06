from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProjectSerializer, ProjectCreateSerializer
from .models import DocumentProject
from django.utils import timezone
from .permissions import IsOwner


class ProjectListAPIView(ListCreateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DocumentProject.objects.filter(owner=user)

    def list(self, request, *args, **kwargs):
        print(request.user.is_authenticated)
        queryset = self.get_queryset()
        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # to not modify original data
        print("data printing: ", data)
        data['owner'] = request.user.id
        data['creation_date'] = timezone.now().date()
        serializer = ProjectCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProjectDetailAPIView(RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsOwner, IsAuthenticated]
    queryset = DocumentProject.objects.all()
    serializer_class = ProjectSerializer
    model = DocumentProject

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
