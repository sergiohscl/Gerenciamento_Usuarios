import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.models import Usuario
from apps.accounts.apis.serializers import UserSerializer


GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"


class GoogleAuthAPIView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ["post"]

    def post(self, request):
        code = request.data.get("code")
        if not code:
            raise ValidationError(
                {"code": ["Código do Google é obrigatório."]}
            )

        data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        }

        token_res = requests.post(GOOGLE_TOKEN_URL, data=data, timeout=10)
        if token_res.status_code != 200:
            return Response(
                {"detail": "Falha ao obter token do Google.", "google": token_res.json()}, # noqa E501
                status=status.HTTP_400_BAD_REQUEST,
            )

        access_token = token_res.json().get("access_token")
        if not access_token:
            return Response(
                {"detail": "Token do Google inválido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        userinfo_res = requests.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )

        if userinfo_res.status_code != 200:
            return Response(
                {"detail": "Falha ao obter userinfo do Google.", "google": userinfo_res.json()}, # noqa E501
                status=status.HTTP_400_BAD_REQUEST,
            )

        userinfo = userinfo_res.json()
        email = userinfo.get("email")
        userinfo.get("name") or ""
        userinfo.get("picture")

        if not email:
            return Response(
                {"detail": "Google não retornou email."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = Usuario.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
            },
        )

        if not user.username:
            user.username = email.split("@")[0]

        user.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login com Google realizado com sucesso!",
                "user": UserSerializer(user).data,
                "tokens": {"refresh": str(refresh), "access": str(refresh.access_token)}, # noqa E501
            },
            status=status.HTTP_200_OK,
        )
