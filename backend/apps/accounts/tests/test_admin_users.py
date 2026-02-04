from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import AbstractBaseUser
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def jwt_auth(client: APIClient, user: AbstractBaseUser) -> dict:
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return {"access": access, "refresh": str(refresh)}


class AdminUsersAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_superuser(
            username="admin",
            email="admin@admin.com",
            password="admin123"
        )
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="user12345"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="user12345"
        )

        self.list_url = reverse("admin-user-list")
        self.detail_url_user1 = reverse(
            "admin-user-detail", kwargs={"user_id": self.user1.id}
        )

    def test_admin_list_users_success(self):
        jwt_auth(self.client, self.admin)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

        returned_ids = {u["id"] for u in response.data}
        self.assertIn(self.admin.id, returned_ids)
        self.assertIn(self.user1.id, returned_ids)
        self.assertIn(self.user2.id, returned_ids)

    def test_admin_list_users_unauthenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_list_users_forbidden_for_normal_user(self):
        jwt_auth(self.client, self.user1)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_get_user_by_id_success(self):
        jwt_auth(self.client, self.admin)

        response = self.client.get(self.detail_url_user1)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user1.id)
        self.assertEqual(response.data["email"], self.user1.email)
        self.assertEqual(response.data["username"], self.user1.username)

    def test_admin_get_user_by_id_not_found(self):
        jwt_auth(self.client, self.admin)

        url = reverse("admin-user-detail", kwargs={"user_id": 999999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_admin_get_user_by_id_forbidden_for_normal_user(self):
        jwt_auth(self.client, self.user1)

        response = self.client.get(self.detail_url_user1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_delete_user_success(self):
        jwt_auth(self.client, self.admin)

        response = self.client.delete(self.detail_url_user1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.user1.id).exists())

    def test_admin_delete_user_not_found(self):
        jwt_auth(self.client, self.admin)

        url = reverse("admin-user-detail", kwargs={"user_id": 999999})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_admin_delete_user_forbidden_for_normal_user(self):
        jwt_auth(self.client, self.user1)

        response = self.client.delete(self.detail_url_user1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MeAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="user12345"
        )

        self.me_url = reverse("me")

    def test_me_success_authenticated(self):
        jwt_auth(self.client, self.user)

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["username"], self.user.username)

    def test_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
