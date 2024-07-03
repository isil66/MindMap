from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class DocumentProject(models.Model):
    prj_name = models.CharField(max_length=255)
    creation_date = models.DateField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
