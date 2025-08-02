import datetime
import csv
from django.http import HttpResponse
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from purchase.models import Schedule, Year, PurchaseHistory
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
from approval.models import Transfer as TransferApproval
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

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        items = Item.objects.all()
        if items.exists():
            try:
                item_location_list = [
                    Inventory(location=instance, item=i) for i in items
                ]
                Inventory.objects.bulk_create(item_location_list)
            except Exception as e:
                print(e)
                raise serializers.ValidationError(
                    {"error": "Error while creating Location."}
                )


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
        "row__code",
        "row__name",
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

        try:
            serializer.is_valid(raise_exception=True)
            item = serializer.save()
            item.save()
            if Location.objects.exists():
                item_location_list = [
                    Inventory(location=l, item=item) for l in Location.objects.all()
                ]
                Inventory.objects.bulk_create(item_location_list)
            years = Year.objects.filter(no__gte=datetime.date.today().year)
            if years.exists():
                item_year_list = [Schedule(year=y, item=item) for y in years]
                Schedule.objects.bulk_create(item_year_list)
        except Exception as e:
            print(e)
            raise serializers.ValidationError({"error": "Error while creating item"})


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
    def download(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="inventory.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                "Item ID",
                "Item Name",
                "UoM",
                "Location Code",
                "Location Name",
                "Minimum Stock Level",
                "Balance",
                "Purchased",
                "Inbound Transfers",
                "Outbound Transfers",
            ]
        )
        for inv in queryset:
            writer.writerow(
                [
                    inv.item.no,
                    inv.item.name,
                    inv.item.uom.code,
                    inv.location.code,
                    inv.location.name,
                    inv.item.minimum_stock_level,
                    inv.balance,
                    inv.purchased,
                    inv.inbound_transfers,
                    inv.outbound_transfers,
                ]
            )
        return response

    @action(detail=False, methods=["GET"])
    def revaluate_stock(self, request):
        items = Item.objects.all()
        locations = Location.objects.all()
        for item in items:
            for location in locations:
                Inventory.objects.get_or_create(item=item, location=location)

        # all_purchases = Request.objects.values("item_id").annotate(
        #     total_received=Sum("received_quantity")
        # )

        inventories_to_update = Inventory.objects.all()
        updated_inventory_instances = []

        for inv_item in inventories_to_update:
            try:
                inv_item.purchased = (
                    PurchaseHistory.objects.filter(
                        item=inv_item.item, location=inv_item.location
                    ).aggregate(total_received=Sum("quantity"))["total_received"]
                    or 0
                )
            except Exception as e:
                print(f"Purchased error {e}")
                inv_item.purchased = 0
            try:
                inv_item.inbound_transfers = (
                    TransferHistory.objects.filter(
                        location=inv_item.location, item=inv_item.item, type="INBOUND"
                    ).aggregate(total_quantity=Sum("quantity"))["total_quantity"]
                    or 0
                )
            except Exception as e:
                print(f"Inbound error {e}")
                inv_item.inbound_transfers = 0
            try:
                inv_item.outbound_transfers = (
                    TransferHistory.objects.filter(
                        location=inv_item.location, item=inv_item.item, type="OUTBOUND"
                    ).aggregate(total_quantity=Sum("quantity"))["total_quantity"]
                    or 0
                )
            except Exception as e:
                print(f"Outbound error {e}")
                inv_item.outbound_transfers = 0
            inv_item.balance = inv_item.purchased + (
                inv_item.inbound_transfers - inv_item.outbound_transfers
            )

            updated_inventory_instances.append(inv_item)

        if updated_inventory_instances:
            Inventory.objects.bulk_update(
                updated_inventory_instances,
                [
                    # "purchased",
                    "inbound_transfers",
                    "outbound_transfers",
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
        requested_items = self.request.data.get("requested_items")

        for i in requested_items:
            if i["quantity"] is None or i["quantity"] <= 0 or i["quantity"] == "":
                raise serializers.ValidationError({"quantity": "Quantity is invalid."})

            if not Item.objects.filter(id=i["item_id"]).exists():
                raise serializers.ValidationError(
                    {
                        "item_id",
                        f"Item Does not exist!",
                    },
                )

        try:
            serializer.is_valid(raise_exception=True)
            transfer = serializer.save(requested_by=self.request.user)
            transfer_item_list = [
                TransferItem(
                    transfer=transfer,
                    item=Item.objects.get(id=i["item_id"]),
                    requested_quantity=i["quantity"],
                )
                for i in requested_items
            ]
            TransferItem.objects.bulk_create(transfer_item_list)
            TransferApproval.objects.create(transfer=transfer)
        except Item.DoesNotExist:
            raise serializers.ValidationError({"item_id", "Item does not exist!"})
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                {"error", "Error while creating Transfer."}
            )

    @action(detail=True, methods=["PATCH"])
    def ship(self, request, pk=None):
        transfer = self.get_object()
        shipped_items = request.data.get("shipped_items")
        if not shipped_items:
            raise serializers.ValidationError({"error": "Nothing to Ship."})
        try:
            shipment_list = []
            for i in shipped_items:
                item = Item.objects.get(id=i["item_id"])
                transfer_item = TransferItem.objects.get(transfer=transfer, item=item)
                if transfer_item.remaining_quantity < int(i["quantity"]):
                    raise serializers.ValidationError(
                        {
                            "error": "The shipped quantity cannot be greater than the remaining quantity."
                        }
                    )
                if int(i["quantity"]) > 0:
                    shipment_list.append(
                        TransferHistory(
                            transfer=transfer,
                            item=item,
                            location=transfer.from_location,
                            type="OUTBOUND",
                            quantity=int(i["quantity"]),
                        )
                    )
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "One or more items do not exist."}
            )
        except TransferItem.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "Transfer for one or more item does not exist."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error", "Error while shipping."})

        TransferHistory.objects.bulk_create(shipment_list)
        serializer = self.get_serializer(transfer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["PATCH"])
    def receive(self, request, pk=None):
        transfer = self.get_object()
        shipped_items = TransferHistory.objects.filter(
            transfer=transfer, type="OUTBOUND", completed=False
        )
        transfer_items = TransferItem.objects.filter(transfer=transfer)
        try:
            received_list = []
            for i in transfer_items:
                total = (
                    shipped_items.filter(item=i.item).aggregate(
                        total_quantity=Sum("quantity")
                    )["total_quantity"]
                    or 0
                )
                received_list.append(
                    TransferHistory(
                        transfer=transfer,
                        item=i.item,
                        location=transfer.to_location,
                        completed=True,
                        quantity=total,
                        type="INBOUND",
                    )
                )
            if received_list:
                TransferHistory.objects.bulk_create(received_list)
                shipped_items.update(completed=True)
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "One or more items do not exist."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        serializer = self.get_serializer(transfer)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
