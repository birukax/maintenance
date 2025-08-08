from django.urls import path, include
from rest_framework import routers
from .views import (
    ActivityViewSet,
    ClearanceViewSet,
    WorkOrderViewSet,
    ActivityTypeViewSet,
    WorkOrderTypeViewSet,
    WorkOrderActivityViewSet,
    WorkOrderClearanceViewSet,
)

router = routers.DefaultRouter()

router.register(
    r"clearances",
    ClearanceViewSet,
    basename="clearance",
)
router.register(
    r"work-order-types",
    WorkOrderTypeViewSet,
    basename="work-order-type",
)
router.register(
    r"activity-types",
    ActivityTypeViewSet,
    basename="activity-type",
)
router.register(
    r"activities",
    ActivityViewSet,
    basename="activity",
)
router.register(
    r"work-orders",
    WorkOrderViewSet,
    basename="work-order",
)
router.register(
    r"work-order-activities",
    WorkOrderActivityViewSet,
    basename="work-order-activity",
)
router.register(
    r"work-order-clearances",
    WorkOrderClearanceViewSet,
    basename="work-order-clearance",
)

urlpatterns = [
    path("", include(router.urls)),
]
