import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from approval.models import Purchase
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
    ConsumptionSerializer,
    ReturnSerializer,
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

    def perform_create(self, serializer):
        uom_id = serializer.validated_data.pop("uom_id")
        suppliers_id = self.request.data.get("suppliers_id")
        try:
            uom = UnitOfMeasure.objects.get(id=uom_id)
            suppliers = Contact.objects.filter(id__in=suppliers_id)
        except UnitOfMeasure.DoesNotExist:
            raise serializers.ValidationError(
                {"uom_id": f"Unit of measure with id {uom_id} does not exist."}
            )
        except Contact.DoesNotExist:
            raise serializers.ValidationError(
                {"suppliers_id": f"Contact with id {suppliers_id} does not exist."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

        item = serializer.save(uom=uom)
        if suppliers.exists():
            item.suppliers.set(suppliers)
        Inventory.objects.create(item=item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        suppliers_id = self.request.data.get("suppliers_id")
        
        try:
            suppliers = Contact.objects.filter(id__in=suppliers_id)
        except Contact.DoesNotExist:
            raise serializers.ValidationError(
                {"suppliers_id": f"Contact with id {suppliers_id} does not exist."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

        item = serializer.save()
        if suppliers.exists():
            item.suppliers.set(suppliers)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    queryset = Inventory.objects.all()

    @action(detail=False, methods=["GET"])
    def revaluate_stock(self, request):
        inventories = Inventory.objects.all()
        purchases = PurchaseRequest.objects.all()
        consumptions = Consumption.objects.all()
        returns = Return.objects.filter(used=False)
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

    def perform_create(self, serializer):
        item_id = serializer.validated_data.pop("item_id")
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {"item_id": f"Item with id {item_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        purchase_request = serializer.save(
            requested_by=self.request.user,
            item=item,
        )
        Purchase.objects.create(purchase_request=purchase_request)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["PATCH"])
    def receive(self, request, pk=None):
        purchase_request = self.get_object()
        received_quantity = int(request.data.get("received_quantity"))
        received_date = request.data.get("received_date")
        if received_quantity is not None:
            if received_quantity > purchase_request.quantity:
                raise serializers.ValidationError(
                    {
                        "received_quantity": "Received quantity cannot be greater than requested quantity."
                    }
                )
            if received_quantity <= 0:
                raise serializers.ValidationError(
                    {"received_quantity": "Received quantity cannot be less than 1."}
                )

        else:
            raise serializers.ValidationError(
                {"received_quantity": "Received quantity is required."}
            )
        purchase_request.received_quantity = received_quantity
        purchase_request.received_date = received_date
        purchase_request.status = "RECEIVED"
        purchase_request.save()
        serializer = PurchaseRequestSerializer(purchase_request)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConsumptionViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumptionSerializer
    queryset = Consumption.objects.all()


class ReturnViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnSerializer
    queryset = Return.objects.all()
