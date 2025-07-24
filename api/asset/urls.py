from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

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

router.register(
    r"plants",
    views.PlantViewSet,
    basename="plant",
)
router.register(
    r"areas",
    views.AreaViewSet,
    basename="area",
)

urlpatterns = [
    path("", include(router.urls)),
]
