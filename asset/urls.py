from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"locations",
    views.LocationViewSet,
    basename="location",
)
router.register(
    r"machines",
    views.MachineViewSet,
    basename="machine",
)
router.register(
    r"equipments",
    views.EquipmentViewSet,
    basename="equipment",
)

urlpatterns = [
    path("", include(router.urls)),
]
