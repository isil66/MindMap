from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreationSerializer


class UserListAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        data = [{'username': user.username, 'email': user.email} for user in users]
        return Response(data, status=status.HTTP_200_OK)


class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserCreationSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                return Response({'error': 'A user with that email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()

            return Response({'message': 'User registered successfully', 'redirect': 'dashboard/'},
                            status=status.HTTP_201_CREATED)
        return Response({'error': f'{serializer.errors}'}, status=status.HTTP_400_BAD_REQUEST)