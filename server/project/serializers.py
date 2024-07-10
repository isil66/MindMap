from rest_framework import serializers
from .models import DocumentProject, Page


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentProject
        fields = ['id', 'prj_name', 'creation_date']


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentProject
        fields = ['id', 'prj_name', 'creation_date', 'owner']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'project', 'content', 'last_modified']
