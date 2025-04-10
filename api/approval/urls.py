from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"purchase-approvals",
    views.PurchaseViewSet,
    basename="purchase-approval",
)

urlpatterns = [
    path("", include(router.urls)),
]
