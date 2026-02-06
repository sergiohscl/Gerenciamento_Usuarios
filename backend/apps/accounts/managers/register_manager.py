from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from ..models import Usuario


class RegisterManager:
    @staticmethod
    def validate(data):
        password = data.get("password", "")
        password2 = data.get("password2", "")

        if password != password2:
            raise ValidationError(
                {"password2": ["As senhas não correspondem."]}
            )

        email = data.get("email", "").strip()
        if Usuario.objects.filter(email=email).exists():
            raise ValidationError(
                {"email": ["Este email já está registrado."]}
            )

        if len(password) < 8:
            raise ValidationError(
                {"password": ["Precisa conter pelo menos 8 caracteres."]}
            )

        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise ValidationError({"password": list(e.messages)})

        return data

    @staticmethod
    def create(data):
        avatar = data.pop("avatar", None)
        data.pop("password2", None)

        user = Usuario.objects.create_user(
            username=data["username"],
            email=data["email"],
        )
        user.set_password(data["password"])

        if avatar:
            if isinstance(avatar, list):
                avatar = avatar[0]
            user.avatar = avatar

        user.save()
        return user
