from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class LoginAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("auth-login")

        self.user = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="user12345"
        )

        self.valid_data = {
            "email": "user1@example.com",
            "password": "user12345"
        }

        self.invalid_data = {
            "email": "user1@example.com",
            "password": "wrongpassword"
        }

        self.missing_data = {
            "email": "",
            "password": ""
        }

    def test_login_success(self):
        response = self.client.post(self.url, self.valid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("user", response.data)

        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])

    def test_login_invalid_credentials(self):
        response = self.client.post(self.url, self.invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("errors", response.data)

    def test_login_missing_credentials(self):
        response = self.client.post(self.url, self.missing_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("errors", response.data)
