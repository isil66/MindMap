from rest_framework import permissions
from .models import DocumentProject


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        print("permisions called")
        if isinstance(obj, DocumentProject):
            return obj.owner == request.user
        return False
