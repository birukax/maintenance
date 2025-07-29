from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()


router.register(
    r"years",
    views.YearViewSet,
    basename="year",
)

router.register(
    r"schedules",
    views.ScheduleViewSet,
    basename="schedule",
)
router.register(
    r"requests",
    views.RequestViewSet,
    basename="request",
)
router.register(
    r"request-items",
    views.RequestItemViewSet,
    basename="request-item",
)
router.register(
    r"purchase-histories",
    views.PurchaseHistoryViewSet,
    basename="purchase-history",
)
urlpatterns = [
    path("", include(router.urls)),
]
