from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"activity-types",
    views.ActivityTypeViewSet,
    basename="activity-type",
)
router.register(
    r"activities",
    views.ActivityViewSet,
    basename="activity",
)
router.register(
    r"work-orders",
    views.WorkOrderViewSet,
    basename="work-order",
)
router.register(
    r"work-order-activities",
    views.WorkOrderActivityViewSet,
    basename="work-order-activity",
)

router.register(
    r"work-order-types",
    views.WorkOrderTypeViewSet,
    basename="work-order-type",
)

urlpatterns = [
    path("", include(router.urls)),
]
