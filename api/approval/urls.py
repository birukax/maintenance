from django.urls import path, include
from rest_framework import routers
from .views import PurchaseViewSet, TransferViewSet

router = routers.DefaultRouter()

router.register(
    r"purchase-approvals",
    PurchaseViewSet,
    basename="purchase-approval",
)

router.register(
    r"transfer-approvals",
    TransferViewSet,
    basename="transfer-approval",
)


urlpatterns = [
    path("", include(router.urls)),
]
