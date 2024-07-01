# from rest_framework import serializers
# from .models import User
#
#
# # model (serialization ->) json
# # json (deserialization ->) model
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = '__all__'
#         extra_kwargs = {'password': {'write_only': True}}
#         # GET atınca bana password verme, sadece yaratırkene al
#
#     def create(self, validated_data):
#         # objects is the manager of user model
#         # create_user çağır so that the password is hashed and not stored directly on db
#         user = User.objects.create_user(**validated_data)
#         return user
