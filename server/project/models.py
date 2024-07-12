from django.db import models
from django.contrib.auth.models import User



class DocumentProject(models.Model):
    prj_name = models.CharField(max_length=255)
    creation_date = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


class Page(models.Model):
    project = models.ForeignKey(DocumentProject, on_delete=models.CASCADE)
    content = models.TextField()
    last_modified = models.DateTimeField(auto_now_add=True)
