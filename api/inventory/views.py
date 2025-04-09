from django.db.models import Sum
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
    Consumption,
    Return,
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

    @action(detail=False, methods=["GET"])
    def revaluate_stock(self, request):
        inventories = Inventory.objects.all()
        purchases = PurchaseRequest.objects.all()
        consumptions = Consumption.objects.all()
        returns = Return.objects.all()
        for i in inventories:
            if purchases.filter(item=i.item).exists():
                i.purchased_quantity = (
                    purchases.filter(item=i.item)
                    .aggregate(total=Sum("received_quantity"))
                    .get("total")
                )
            else:
                i.purchased_quantity = 0
            if consumptions.filter(item=i.item).exists():
                i.consumed_quantity = (
                    consumptions.filter(item=i.item)
                    .aggregate(total=Sum("quantity"))
                    .get("total")
                )
            else:
                i.consumed_quantity = 0
            if returns.filter(item=i.item).exists():
                i.returned_quantity = (
                    returns.filter(item=i.item)
                    .aggregate(total=Sum("quantity"))
                    .get("total")
                )
            else:
                i.returned_quantity = 0
            i.save()
            i.balance = i.purchased_quantity - i.consumed_quantity + i.returned_quantity
            i.save()
        serializer = InventorySerializer(inventories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PurchaseScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseScheduleSerializer
    queryset = PurchaseSchedule.objects.all()


class MonthlyPurchaseScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = MonthlyPurchaseScheduleSerializer
    queryset = MonthlyPurchaseSchedule.objects.all()


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseRequestSerializer
    queryset = PurchaseRequest.objects.all()
