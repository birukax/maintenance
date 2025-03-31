from django.urls import path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views


router = routers.DefaultRouter()
router.register(
    r"users",
    views.UserViewSet,
    basename="user",
)
router.register(
    r"unit-of-measures",
    views.UnitOfMeasureViewSet,
    basename="unit-of-measure",
)
router.register(
    r"contacts",
    views.ContactViewSet,
    basename="contact",
)
router.register(
    r"items",
    views.ItemViewSet,
    basename="item",
)
router.register(
    r"inventorys",
    views.InventoryViewSet,
    basename="inventory",
)
router.register(
    r"purchase-schedules",
    views.PurchaseScheduleViewSet,
    basename="purchase-schedule",
)
router.register(
    r"monthly-purchase-schedules",
    views.MonthlyPurchaseScheduleViewSet,
    basename="monthly-purchase-schedule",
)
router.register(
    r"purchase-requests",
    views.PurchaseRequestViewSet,
    basename="purchase-request",
)

urlpatterns = [
    path("", include(router.urls)),
]
