from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
)
from .serializers import (
    UnitOfMeasureSerializer,
    ContactSerializer,
    ItemSerializer,
    InventorySerializer,
    PurchaseScheduleSerializer,
    MonthlyPurchaseScheduleSerializer,
    PurchaseRequestSerializer,
)


class UnitOfMeasureViewSet(viewsets.ModelViewSet):
    serializer_class = UnitOfMeasureSerializer
    queryset = UnitOfMeasure.objects.all()


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    queryset = Inventory.objects.all()


class PurchaseScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseScheduleSerializer
    queryset = PurchaseSchedule.objects.all()


class MonthlyPurchaseScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = MonthlyPurchaseScheduleSerializer
    queryset = MonthlyPurchaseSchedule.objects.all()


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseRequestSerializer
    queryset = PurchaseRequest.objects.all()
