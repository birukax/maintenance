import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from approval.models import Purchase
from purchase.models import Request, Schedule, MonthlySchedule
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    Consumption,
    Return,
)
from .serializers import (
    UnitOfMeasureSerializer,
    ContactSerializer,
    ItemSerializer,
    InventorySerializer,
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
        try:
            item = serializer.save(uom=uom)
            if suppliers.exists():
                item.suppliers.set(suppliers)
            Inventory.objects.create(item=item)
            schedule = Schedule.objects.create(
                item=item, year=datetime.date.today().year
            )
            MonthlySchedule.objects.create(schedule=schedule)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
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
        purchases = Request.objects.all()
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


class ConsumptionViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumptionSerializer
    queryset = Consumption.objects.all()


class ReturnViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnSerializer
    queryset = Return.objects.all()
