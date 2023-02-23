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
    approve_product,
    detailProduct,
    setMain,
)

from .views_f.variants import (
    get_variants,
    updateVariant,
    variantList
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
    path("update-variant/<str:id>", updateVariant),
    path('variant-list/<str:pagenum>', variantList),
    path('product-detail/<str:id>', detailProduct),
    path('set-main/<int:id>/<int:new>', setMain),
]