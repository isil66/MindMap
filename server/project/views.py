from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import ProjectSerializer, ProjectCreateSerializer, PageSerializer
from .models import DocumentProject, Page
from django.utils import timezone
from .permissions import IsOwner


class ProjectAPIView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = DocumentProject.objects.all()
    serializer_class = ProjectSerializer

    # dashboard/ GET
    def get_queryset(self):
        user = self.request.user
        return DocumentProject.objects.filter(owner=user)

    # dashboard/ POST
    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # to not modify original data
        print("data printing: ", data)
        data['owner'] = request.user.id
        serializer = ProjectCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # dashboard/{prj_id}/ GET
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()  # get the prj w the spesified id
        pages = Page.objects.filter(project=instance).order_by('id')

        if not pages.exists():
            first_page_data = {
                'project': instance.id,
                'content': '<h1>Start Your Writing Journey</h1>'
            }
            first_page_serializer = PageSerializer(data=first_page_data)
            if first_page_serializer.is_valid():
                first_page_serializer.save()
                pages = [first_page_serializer.instance]
            else:
                return Response(first_page_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        project_serializer = self.get_serializer(instance)
        page_serializer = PageSerializer(pages, many=True)

        response_data = {
            'project': project_serializer.data,
            'pages': page_serializer.data,
        }
        # todo burda tüm prj page sayısını da çekip yolla?
        return Response(response_data, status=status.HTTP_200_OK)
