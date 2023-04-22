from django.urls import path, re_path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views_f.default import (
    register,
    MyTokenObtainPairView,
    index,
    importAll,
    migrate,
    getFilters,
    addDefault,
    test
)

from .views_f.products import (
    listProducts,
    approve_product,
    detailProduct,
    setMain,
    setAllApproved,
    addCategory,
    removeCategory
)

from .views_f.variants import (
    get_variants,
    updateVariant,
    variantList,
    variantDetail,
    setVisibility,
    setVisMultiple,
)

from .views_f.category import (
    pullCats,
    getTree,
    updateCat,
    deleteCat,
    getTreeWithout,
    moveCat,
    getSupplierCats,
    getBySource,
    getPairingCategories,
    pairCategories,
    unpairCategories,
    updateAction
)

from .views_f.rules import (
    getRules,
    createRule
)

from .views_f.parameters import (
    getParamNames,
    updateParamName
)

from .views_f.manufacturers import (
    manList,
    updateManName,
)

from .views_f.availabilities import (
    getSupplierAvailab,
    setBuyable,
    setNames,
    setActive,
)

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="obtain_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    
    path("register-user/", register),
    path("overview/", index),
    path("import-all/", importAll),
    path("migrate/", migrate),
    path('get-filters/', getFilters),
    path('add-default/', addDefault),
    path('test/', test),
    
    path("product-list/<str:pagenum>/<str:approvement>/<str:cat>/<str:supp>/<str:man>/<str:que>", listProducts),
    path("approve_product/<str:id>/<str:approve>", approve_product),
    path("get-variants/<str:id>", get_variants),
    path("update-variant/<str:id>", updateVariant),
    path('variant-list/<str:pagenum>/<str:approvement>/<str:cat>/<str:supp>/<str:man>/<str:que>', variantList),
    path('product-detail/<str:id>', detailProduct),
    path('set-main/<int:id>/<int:new>', setMain),
    path('variant-detail/<int:id>', variantDetail),
    path('set-visibility/<int:id>/<str:new>', setVisibility),
    path('pull-cats/', pullCats),
    path('categories/', getTree),
    path('update-category/<int:id>', updateCat),
    path('delete-category/<int:id>', deleteCat),
    # path('categories-excluded/<int:id>', getTreeWithout),
    path('move-category/<int:id>/<int:new>', moveCat),
    path('supplier-cats/', getSupplierCats),
    path('cats-from-source/<int:id>', getBySource),
    path('category-pairing/', getPairingCategories),
    path('pair-categories/<int:whom>/<int:to>', pairCategories),
    path('unpair-categories/<int:whom>/<int:what>', unpairCategories),
    path('update-action/<int:whom>/<int:to>', updateAction),
    path('rules/', getRules),
    path('parameters/', getParamNames),
    path('update-param-name/<int:id>', updateParamName),
    path('approve-all/<str:approvement>', setAllApproved),
    
    path('manufacturers/', manList),
    path('update-manufacturer-name/<int:id>', updateManName),
    path('update-mul-vis/<str:new>', setVisMultiple),
    
    path('supp-availab/', getSupplierAvailab),
    
    path('availability-buyable/<int:id>/<int:b>', setBuyable),
    path('availability-names/<int:id>', setNames),
    path('availability-active/<int:id>/<int:a>', setActive),
    path('add-cat/<int:target>/<int:cat>', addCategory),
    path('remove-cat/<int:target>/<int:cat>', removeCategory),
    path('create_rule/', createRule),
]