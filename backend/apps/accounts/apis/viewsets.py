# apps/accounts/api/viewsets.py
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from apps.accounts.apis.serializers import UserSerializer, LoginSerializer, LogoutSerializer # noqa E501
from apps.accounts.managers.permissions import IsSuperUser
from apps.accounts.managers.register_manager import RegisterManager
from apps.accounts.models import Usuario
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.settings import api_settings


def get_tokens_for_user(user: Usuario) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    serializer_class = UserSerializer
    http_method_names = ["post"]
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "username", openapi.IN_FORM,
                description="Username.",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                "email", openapi.IN_FORM,
                description="E-mail do usuário.",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                "password", openapi.IN_FORM,
                description="Senha do usuário.",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                "password2", openapi.IN_FORM,
                description="Confirmação da senha.",
                type=openapi.TYPE_STRING, required=True
            ),
            openapi.Parameter(
                "avatar", openapi.IN_FORM,
                description="Avatar do usuário.",
                type=openapi.TYPE_FILE
            ),
        ],
        responses={201: openapi.Response("Usuário registrado com sucesso!")},
        operation_summary="(ADMIN) Registra usuário",
    )
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data["avatar"] = request.FILES.get("avatar")

        try:
            validated_data = RegisterManager.validate(data)
            user = RegisterManager.create(validated_data)

            tokens = get_tokens_for_user(user)
            response_serializer = UserSerializer(user)

            return Response(
                {
                    "message": "Usuário registrado com sucesso!",
                    "user": response_serializer.data,
                    "tokens": tokens,
                },
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return Response(
                {"errors": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ["post"]

    @swagger_auto_schema(
        request_body=LoginSerializer,
        operation_summary="Autentica usuário (JWT)",
        responses={200: UserSerializer},
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": "E-mail e senha são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        try:
            user_obj = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return Response(
                {"errors": "Credenciais inválidas."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=user_obj.username, password=password)

        if user is None:
            return Response(
                {"errors": "Credenciais inválidas."},
                status=status.HTTP_400_BAD_REQUEST
            )

        tokens = get_tokens_for_user(user)
        response_serializer = UserSerializer(user)

        return Response(
            {
                "message": "Login bem-sucedido!",
                "user": response_serializer.data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["post"]

    @swagger_auto_schema(
        request_body=LogoutSerializer,
        operation_summary="Logout (blacklist do refresh token)",
        responses={200: openapi.Response("Logout realizado com sucesso!")},
    )
    def post(self, request, *args, **kwargs):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"error": "Refresh token inválido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Logout realizado com sucesso!"},
            status=status.HTTP_200_OK
        )


class UserListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        qs = Usuario.objects.all().order_by("-id")

        paginator_class = api_settings.DEFAULT_PAGINATION_CLASS
        if paginator_class is None:
            serializer = UserSerializer(qs, many=True)
            return Response(serializer.data)

        paginator = paginator_class()
        page = paginator.paginate_queryset(qs, request, view=self)
        serializer = UserSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]
    http_method_names = ["get", "delete"]

    @swagger_auto_schema(
        operation_summary="(ADMIN) Busca usuário por ID",
        responses={200: UserSerializer},
    )
    def get(self, request, user_id, *args, **kwargs):
        try:
            user = Usuario.objects.get(id=user_id)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="(ADMIN) Deleta usuário por ID",
        responses={204: openapi.Response("Usuário deletado com sucesso.")},
    )
    def delete(self, request, user_id, *args, **kwargs):
        try:
            user = Usuario.objects.get(id=user_id)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get"]

    @swagger_auto_schema(
        operation_summary="Retorna dados do usuário logado",
        responses={200: UserSerializer},
    )
    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
