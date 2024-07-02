from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import UserCreationSerializer, UserLoginSerializer
from django.shortcuts import get_object_or_404


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
            user = User.objects.get(email=email)
            token = Token.objects.create(user=user)
            print(token.key)
            return Response({'message': 'User registered successfully', 'redirect': 'dashboard/', 'token': token.key},
                            status=status.HTTP_201_CREATED)
        return Response({'error': f'{serializer.errors}'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    # require email and password
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            if not user:
                return Response({'error': 'You do not have an account'}, status=status.HTTP_400_BAD_REQUEST)
            if not user.check_password(serializer.validated_data['password']):
                return Response({'error': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST)
            token, created = Token.objects.get_or_create(user=user)
            Response({'message': 'Welcome.', 'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Please fill all the fields.'}, status=status.HTTP_400_BAD_REQUEST)
