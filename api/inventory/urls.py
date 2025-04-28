from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()


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
    r"inventories",
    views.InventoryViewSet,
    basename="inventory",
)
router.register(
    r"consumptions",
    views.ConsumptionViewSet,
    basename="consumption",
)
router.register(
    r"returns",
    views.ReturnViewSet,
    basename="return",
)
urlpatterns = [
    path("", include(router.urls)),
]
