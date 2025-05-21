from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()


router.register(
    r"contacts",
    views.ContactViewSet,
    basename="contact",
)
router.register(
    r"locations",
    views.LocationViewSet,
    basename="location",
)
router.register(
    r"shelves",
    views.ShelfViewSet,
    basename="shelf",
)
router.register(
    r"shelf-rows",
    views.ShelfRowViewSet,
    basename="shelf-row",
)
router.register(
    r"shelf-boxes",
    views.ShelfBoxViewSet,
    basename="shelf-box",
)
router.register(
    r"unit-of-measures",
    views.UnitOfMeasureViewSet,
    basename="unit-of-measure",
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
    r"transfers",
    views.TransferViewSet,
    basename="transfer",
)
router.register(
    r"transfer-items",
    views.TransferItemViewSet,
    basename="transfer-item",
)
router.register(
    r"transfer-histories",
    views.TransferHistoryViewSet,
    basename="transfer-history",
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
