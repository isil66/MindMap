from rest_framework import serializers
from django.contrib.auth.models import User


# model (serialization ->) json
# json (deserialization ->) model
# But when you want to deserialize you pass the data with a data kwarg.
# serializer = CommentSerializer(data=data)
class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}
        # GET atınca bana password verme, sadece yaratırkene al

    def create(self, validated_data):
        # objects is the manager of user model
        # create_user çağır so that the password is hashed and not stored directly on db

        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
