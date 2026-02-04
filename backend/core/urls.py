from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.apis.viewsets import LoginAPIView, LogoutAPIView, MeAPIView, RegisterAPIView, UserDetailAPIView, UserListAPIView # noqa E501
from core import settings
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="GERENCIAMENTO DE USUÁRIOS API",
        default_version='v1',
        description="CLIENT_API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    # swagger
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0),name='schema-json'), # noqa E501
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), # noqa E501
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'), # noqa E501

    path('admin/', admin.site.urls),

    # AUTH (JWT)
    path('api/v1/auth/register/', RegisterAPIView.as_view(), name='auth-register'), # noqa E501
    path('api/v1/auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('api/v1/auth/logout/', LogoutAPIView.as_view(), name='auth-logout'),

    # REFRESH (SimpleJWT)
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # noqa E501

    # accounts
    path("api/v1/admin/users/", UserListAPIView.as_view(), name="admin-user-list"), # noqa E501
    path("api/v1/admin/users/<int:user_id>/", UserDetailAPIView.as_view(), name="admin-user-detail"), # noqa E501
    path("api/v1/me/", MeAPIView.as_view(), name="me"),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_URL
    )
