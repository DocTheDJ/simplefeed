from django.urls import path

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
)

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="obtain_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    
    path("register-user/", register),
    path("overview/", index),
    path("test/", run),
    
    path("product-list/", listProducts)
]