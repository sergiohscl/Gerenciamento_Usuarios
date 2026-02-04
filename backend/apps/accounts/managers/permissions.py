from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    message = "Apenas super usuários podem acessar este recurso."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser) # noqa E501
