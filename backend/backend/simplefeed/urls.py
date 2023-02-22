from django.urls import path, re_path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views_f.default import (
    register,
    MyTokenObtainPairView,
    index,
    run,
    migrate,
)

from .views_f.products import (
    listProducts,
    approve_product
)

from .views_f.variants import (
    get_variants,
    updateVariant
)

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="obtain_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    
    path("register-user/", register),
    path("overview/", index),
    path("test/", run),
    path("migrate/", migrate),
    
    path("product-list/<str:pagenum>", listProducts),
    path("approve_product/<str:id>/<str:approve>", approve_product),
    path("get-variants/<str:id>", get_variants),
    path("update-variant/<str:id>", updateVariant)
    # re_path(r'^approve_product/(?P<id>\d+)/(?P<approve>\d)$', approve_product),
]