from django.contrib.auth.models import User
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import ProjectSerializer, ProjectCreateSerializer, PageSerializer, PageCreateSerializer, \
    NoteSerializer
from .models import DocumentProject, Page, Note
from django.utils import timezone
from .permissions import IsOwner


class ProjectAPIView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = DocumentProject.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        projects = DocumentProject.objects.filter(owner=user)
        # field lookup için attr__func sql: where clause
        # total_pages_of_user = Page.objects.filter(project__in=projects).count()
        return projects

    # dashboard/ GET
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        user = request.user
        projects = DocumentProject.objects.filter(owner=user)
        total_pages_of_user = Page.objects.filter(project__in=projects).count()

        response_data = {
            'projects': serializer.data,
            'total_page_count': total_pages_of_user
        }
        return Response(response_data, status=status.HTTP_200_OK)

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
        total_pages_in_project = pages.count()

        if not pages.exists():
            first_page_data = {
                'project': instance.id,
                'content': '<h1>Start Your Writing Journey</h1><p></p><p></p><p></p><p></p>'
            }
            first_page_serializer = PageSerializer(data=first_page_data)
            # Modele çeviriyo (deserialized) since we used the data arg
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
            'total_page_count': total_pages_in_project,
        }
        # todo burda tüm prj page sayısını da çekip yolla?
        return Response(response_data, status=status.HTTP_200_OK)


class PageView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    # PATCH dashboard/page/{id}
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            print("serailizer valid")
        else:
            print("serailizer NOT valid")
            return Response(serializer.data, status=status.HTTP_226_IM_USED)
        serializer.save()
        print("partial update")
        return Response(serializer.data, status=status.HTTP_200_OK)

    #  POST dashboard/page/
    def create(self, request, *args, **kwargs):

        # use newlines and logical blocks
        data = request.data.copy()  # to not modify original data
        data['content'] = "<h2>Continue your journey...</h2><p></p><p></p><p></p>"

        serializer = PageCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # GET dashboard/page/{id}
    def retrieve(self, request, *args, **kwargs):
        page_instance = self.get_object()  # get the page instance with given id

        notes = Note.objects.filter(page=page_instance).order_by('id')
        print("notes backend called:", notes)
        if notes.exists():
            print("notes exist")
            notes_serializer = NoteSerializer(notes, many=True)
            return Response({
                'notes': notes_serializer.data
            }, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class NoteView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def list(self, request, *args, **kwargs):
        last_note_object = Note.objects.last()

        if last_note_object:
            response = {
                'largest_current_note_id': last_note_object.id,
            }
            return Response(response, status=status.HTTP_200_OK)

        response = {
            'largest_current_note_id': 0,
        }
        return Response(response, status=status.HTTP_200_OK)

    #  POST dashboard/page/notes/
    def create(self, request, *args, **kwargs):
        print("backened post")
        data = request.data.copy()  # to not modify original data
        print(data)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProjectPagesNotesViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = DocumentProject.objects.all()
    serializer_class = PageSerializer

    def retrieve(self, request, *args, **kwargs):
        project = self.get_object()

        pages = Page.objects.filter(project=project).prefetch_related('note_set').order_by('id')
        response_data = {}

        for page in pages:
            notes_ids = list(page.note_set.values_list('id', flat=True))
            response_data[page.id] = notes_ids

        return Response(response_data, status=status.HTTP_200_OK)
