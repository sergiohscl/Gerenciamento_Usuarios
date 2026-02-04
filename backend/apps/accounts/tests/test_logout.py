from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class LogoutAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("auth-logout")

        self.user = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="user12345"
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)

    def test_logout_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}"
        )

        response = self.client.post(
            self.url,
            {"refresh": self.refresh_token},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)

    def test_logout_without_token(self):
        # sem Authorization header
        response = self.client.post(
            self.url,
            {"refresh": self.refresh_token},
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_without_refresh_body(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}"
        )

        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
