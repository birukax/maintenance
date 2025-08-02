from .models import Item, Location, Inventory, PurchaseHistory, TransferHistory
from django.db.models import Sum
from rest_framework import status
from rest_framework.response import Response


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
