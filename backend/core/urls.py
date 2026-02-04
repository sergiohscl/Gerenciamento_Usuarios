from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # noqa E501
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

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # noqa E501
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # noqa E501
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_URL
    )
