import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from purchase.models import Request, Schedule, Year
from .models import (
    Contact,
    Location,
    Shelf,
    ShelfRow,
    ShelfBox,
    UnitOfMeasure,
    Item,
    Inventory,
    Transfer,
    TransferItem,
    Consumption,
    Return,
    TransferHistory,
)
from .serializers import (
    ContactSerializer,
    LocationSerializer,
    ShelfSerializer,
    ShelfRowSerializer,
    ShelfBoxSerializer,
    UnitOfMeasureSerializer,
    ItemSerializer,
    InventorySerializer,
    TransferSerializer,
    TransferItemSerializer,
    TransferHistorySerializer,
    ConsumptionSerializer,
    ReturnSerializer,
)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    search_fields = ["name", "email", "phone_no", "address"]
    filterset_fields = []


class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()
    search_fields = ["code", "name"]
    filterset_fields = []


class ShelfViewSet(viewsets.ModelViewSet):
    serializer_class = ShelfSerializer
    queryset = Shelf.objects.all()
    search_fields = [
        "code",
        "name",
        "location__code",
        "location__name",
    ]
    filterset_fields = []


class ShelfRowViewSet(viewsets.ModelViewSet):
    serializer_class = ShelfRowSerializer
    queryset = ShelfRow.objects.all()
    search_fields = [
        "code",
        "name",
        "shelf__code",
        "shelf__name",
    ]
    filterset_fields = []


class ShelfBoxViewSet(viewsets.ModelViewSet):
    serializer_class = ShelfBoxSerializer
    queryset = ShelfBox.objects.all()
    search_fields = [
        "code",
        "name",
        "shelf_row__code",
        "shelf_row__name",
    ]
    filterset_fields = []


class UnitOfMeasureViewSet(viewsets.ModelViewSet):
    serializer_class = UnitOfMeasureSerializer
    queryset = UnitOfMeasure.objects.all()
    search_fields = ["code", "name"]
    filterset_fields = []


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    search_fields = [
        "no",
        "name",
        "uom__name",
        "uom__code",
        "shelf__code",
        "shelf__name",
        "row__code",
        "row__name",
        "box__code",
        "box__name",
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
            serializer.is_valid(raise_exception=True)
            item = serializer.save(uom=uom)
            if suppliers.exists():
                item.suppliers.set(suppliers)
            if Location.objects.exists():
                item_location_list = [
                    Inventory(location=l, item=item) for l in Location.objects.all()
                ]
                Inventory.objects.bulk_create(item_location_list)
            years = Year.objects.filter(no__gte=datetime.date.today().year)
            if years.exists():
                item_year_list = [Schedule(year=y.no, item=item) for y in years]
                Schedule.objects.bulk_create(item_year_list)
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

        serializer.is_valid(raise_exception=True)
        item = serializer.save()
        if suppliers.exists():
            item.suppliers.set(suppliers)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    queryset = Inventory.objects.all()
    search_fields = [
        "item__name",
        "item__no",
        "location__name",
        "location__code",
        "balance",
    ]
    filterset_fields = []

    @action(detail=False, methods=["GET"])
    def revaluate_stock(self, request):
        all_purchases = Request.objects.values("item_id").annotate(
            total_received=Sum("received _quantity")
        )
        # all_consumptions = Consumption.objects.values("item_id").annotate(
        #     total_consumed=Sum("quantity")
        # )
        # all_returns = (
        #     Return.objects.filter(used=False)
        #     .values("item_id")
        #     .annotate(total_returned=Sum("quantity"))
        # )
        purchase_map = {p["item_id"]: p["total_received"] for p in all_purchases}
        # consumptions_map = {c["item_id"]: c["total_consumed"] for c in all_consumptions}
        # returns_map = {r["item_id"]: r["total_returned"] for r in all_returns}

        inventories_to_update = Inventory.objects.all()
        updated_inventory_instances = []

        for inv_item in inventories_to_update:
            inv_item.purchased_quantity = purchase_map.get(inv_item.item_id, 0) or 0
            inv_item.inbound_transfers = (
                TransferHistory.objects.filter(
                    location=inv_item.location, item=inv_item.item, type="INBOUND"
                )
                .annotate(total_quantity=Sum("quantity"))
                .values("total_quantity")[0]["total_quantity"]
                or 0
            )
            inv_item.outbound_transfers = (
                TransferHistory.objects.filter(
                    location=inv_item.location, item=inv_item.item, type="OUTBOUND"
                )
                .annotate(total_quantity=Sum("quantity"))
                .values("total_quantity")[0]["total_quantity"]
                or 0
            )

            inv_item.balance = (
                inv_item.purchased_quantity
                + inv_item.inbound_transfers
                - inv_item.outbound_transfers
            )

            updated_inventory_instances.append(inv_item)

        if updated_inventory_instances:
            Inventory.objects.bulk_update(
                updated_inventory_instances,
                [
                    "purchased_quantity",
                    "inbound_transfers",
                    "outbound_transfers",
                    # "consumed_quantity",
                    # "returned_quantity",
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


class TransferViewSet(viewsets.ModelViewSet):
    serializer_class = TransferSerializer
    queryset = Transfer.objects.all()
    search_fields = [
        "requested_by__username",
        "approved_by__username",
        "from_location__code",
        "from_location__name",
        "to_location__code",
        "to_location__name",
    ]
    filterset_fields = [
        "status",
        "requested_date",
        "approved_date",
        "shipment_date",
    ]

    def perform_create(self, serializer):
        requested_by = self.request.user
        from_location_id = self.validated_data.pop("from_location_id")
        to_location_id = self.validated_data.pop("to_location_id")
        requested_items = self.request.get("requested_items")

        try:
            from_location = Location.objects.get(id=from_location_id)
            to_location = Location.objects.get(id=to_location_id)

        except Location.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "from_location",
                    f"location Does not exist!",
                },
                {
                    "to_location",
                    f"location Does not exist!",
                },
            )

        serializer.is_valid(raise_exception=True)
        transfer = serializer.save(
            requested_by=requested_by,
            from_location=from_location,
            to_location=to_location,
        )

        try:
            transfer_item_list = [
                TransferItem(
                    transfer=transfer,
                    item=Item.objects.get(i.item_id),
                    requested_quantity=i.requested_quantity,
                )
                for i in requested_items
            ]
            TransferItem.objects.bulk_create(transfer_item_list)

        except Item.DoesNotExist:
            raise serializers.ValidationError({"error", "Item does not exist!"})

        except Exception as e:
            raise serializers.ValidationError({"error", str(e)})

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TransferItemViewSet(viewsets.ModelViewSet):
    serializer_class = TransferItemSerializer
    queryset = TransferItem.objects.all()
    search__fields = [
        "item__no",
        "item__name",
    ]
    filterset_fields = []


class TransferHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = TransferHistorySerializer
    queryset = TransferHistory.objects.all()
    serach_fields = [
        "item__no",
        "item__name",
        "location__code",
        "location_name",
    ]
    filterset_fields = [
        "type",
        "date",
    ]


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
