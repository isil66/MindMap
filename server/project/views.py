from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProjectSerializer
from .models import DocumentProject


class ProjectListAPIView(ListAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DocumentProject.objects.filter(owner=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
