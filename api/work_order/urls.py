from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"activity-types",
    views.ActivityTypeVeiwSet,
    basename="activity-type",
)
router.register(
    r"activities",
    views.ActivityVeiwSet,
    basename="activity",
)
router.register(
    r"work-orders",
    views.WorkOrderVeiwSet,
    basename="work-order",
)
router.register(
    r"work-order-activities",
    views.WorkOrderActivityVeiwSet,
    basename="work-order-activity",
)

urlpatterns = [
    path("", include(router.urls)),
]
