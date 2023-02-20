from django.urls import path, re_path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views_f.default import (
    register,
    MyTokenObtainPairView,
    index,
    run,
)

from .views_f.products import (
    listProducts,
    approve_product
)

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="obtain_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    
    path("register-user/", register),
    path("overview/", index),
    path("test/", run),
    
    path("product-list/", listProducts),
    path("approve_product/<str:id>/<str:approve>", approve_product),
    # re_path(r'^approve_product/(?P<id>\d+)/(?P<approve>\d)$', approve_product),
]