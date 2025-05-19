import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from purchase.models import Request, Schedule, Year
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
    search_fields = ["code", "name"]
    filterset_fields = []


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    search_fields = ["name", "email", "phone_no", "address"]
    filterset_fields = []


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    search_fields = [
        "no",
        "name",
        "uom__name",
        "uom__code",
        "minimum_stock_level",
    ]
    filterset_fields = ["type", "category"]

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
            years = Year.objects.filter(no__gte=datetime.date.today().year)
            for year in years:
                Schedule.objects.create(item=item, year=year)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
    search_fields = ["item__name", "item__no", "balance"]
    filterset_fields = []

    @action(detail=False, methods=["GET"])
    def revaluate_stock(self, request):
        all_purchases = Request.objects.values("item_id").annotate(
            total_received=Sum("received_quantity")
        )
        all_consumptions = Consumption.objects.values("item_id").annotate(
            total_consumed=Sum("quantity")
        )
        all_returns = (
            Return.objects.filter(used=False)
            .values("item_id")
            .annotate(total_returned=Sum("quantity"))
        )
        purchase_map = {p["item_id"]: p["total_received"] for p in all_purchases}
        consumptions_map = {c["item_id"]: c["total_consumed"] for c in all_consumptions}
        returns_map = {r["item_id"]: r["total_returned"] for r in all_returns}

        inventories_to_update = Inventory.objects.all()
        updated_inventory_instances = []

        for inv_item in inventories_to_update:
            inv_item.purchased_quantity = purchase_map.get(inv_item.item_id, 0) or 0
            inv_item.consumed_quantity = consumptions_map.get(inv_item.item_id, 0) or 0
            inv_item.returned_quantity = returns_map.get(inv_item.item_id, 0) or 0

            inv_item.balance = (
                inv_item.purchased_quantity
                - inv_item.consumed_quantity
                + inv_item.returned_quantity
            )

            updated_inventory_instances.append(inv_item)

        if updated_inventory_instances:
            Inventory.objects.bulk_update(
                updated_inventory_instances,
                [
                    "purchased_quantity",
                    "consumed_quantity",
                    "returned_quantity",
                    "balance",
                ],
            )
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # inventories = Inventory.objects.all()
        # purchases = Request.objects.all()
        # consumptions = Consumption.objects.all()
        # returns = Return.objects.filter(used=False)
        # for i in inventories:
        #     if purchases.filter(item=i.item).exists():
        #         i.purchased_quantity = (
        #             purchases.filter(item=i.item)
        #             .aggregate(total=Sum("received_quantity"))
        #             .get("total")
        #         )
        #     else:
        #         i.purchased_quantity = 0
        #     if consumptions.filter(item=i.item).exists():
        #         i.consumed_quantity = (
        #             consumptions.filter(item=i.item)
        #             .aggregate(total=Sum("quantity"))
        #             .get("total")
        #         )
        #     else:
        #         i.consumed_quantity = 0
        #     if returns.filter(item=i.item).exists():
        #         i.returned_quantity = (
        #             returns.filter(item=i.item)
        #             .aggregate(total=Sum("quantity"))
        #             .get("total")
        #         )
        #     else:
        #         i.returned_quantity = 0
        #     i.save()
        #     i.balance = i.purchased_quantity - i.consumed_quantity + i.returned_quantity
        #     i.save()
        # serializer = InventorySerializer(inventories, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)


class ConsumptionViewSet(viewsets.ModelViewSet):
    serializer_class = ConsumptionSerializer
    queryset = Consumption.objects.all()
    search_fields = ["item__name", "item__no", "date", "quantity"]
    filterset_fields = []

    def perform_create(self, serializer):
        quantity = serializer.validated_data.get("quantity")
        item_id = serializer.validated_data.get("item_id")
        if Item.objects.get(id=item_id).inventory.balance < quantity:
            raise serializers.ValidationError({"quantity": f"Insufficient balance."})
        return super().perform_create(serializer)


class ReturnViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnSerializer
    queryset = Return.objects.all()
    search_fields = ["item__name", "item__no", "date", "quantity"]
    filterset_fields = ["used"]
