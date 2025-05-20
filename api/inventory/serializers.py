from rest_framework import serializers
from account.serializers import UserSerializer
from .models import (
    Contact,
    UnitOfMeasure,
    Location,
    Shelf,
    ShelfBox,
    ShelfRow,
    Item,
    Inventory,
    Transfer,
    TransferItem,
    Consumption,
    Return,
)


class ContactSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Contact
        fields = [
            "id",
            "name",
            "email",
            "phone_no",
            "address",
        ]


class LocationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Location
        fields = [
            "id",
            "code",
            "name",
        ]


class ShelfSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    location = LocationSerializer(read_only=True)
    location_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Shelf
        fields = [
            "id",
            "location",
            "location_id",
            "code",
            "name",
        ]


class ShelfRowSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    shelf = ShelfSerializer(read_only=True)
    shelf_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ShelfRow
        fields = [
            "id",
            "shelf",
            "shelf_id",
            "code",
            "name",
        ]


class ShelfBoxSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    shelf_row = ShelfRowSerializer(read_only=True)

    class Meta:
        model = ShelfBox
        fields = ["id", ""]


class UnitOfMeasureSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = UnitOfMeasure
        fields = [
            "id",
            "code",
            "name",
        ]


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    uom = UnitOfMeasureSerializer(read_only=True)
    uom_id = serializers.IntegerField(write_only=True)
    inventory = serializers.SerializerMethodField(read_only=True)
    suppliers = ContactSerializer(read_only=True, many=True, required=False)

    class Meta:
        model = Item
        fields = [
            "id",
            "no",
            "name",
            "shelf",
            "row",
            "box",
            "uom",
            "uom_id",
            "inventory",
            "minimum_stock_level",
            "type",
            "category",
            "suppliers",
        ]

    def get_inventory(self, obj):
        try:
            inventory_obj = obj.inventory
            return {"id": inventory_obj.id, "balance": inventory_obj.balance}
            # return InventorySerializer(inventory_obj, context=self.context).data
        except Inventory.DoesNotExist:
            return None

class InventorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item = ItemSerializer(read_only=True)
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Inventory
        fields = [
            "id",
            "item",
            "location",
            "purchased",
            "inbound_transfers",
            "outbound_transfers",
            "balance",
        ]


class TransferItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = TransferItem
        fields = [
            "id",
            "transfer",
            "item",
            "item_id",
            "requested_quantity",
            "transfered_quantity",
        ]

    def get_transfer(self, obj):
        try:
            transfer_obj = obj.transfer
            return {
                "id": transfer_obj.id,
                "requested_by": {
                    "id": transfer_obj.requested_by.id,
                    "username": transfer_obj.requested_by.username,
                },
                "approved_by": {
                    "id": transfer_obj.approved_by.id,
                    "username": transfer_obj.approved_by.username,
                },
                "from_location": {
                    "id": transfer_obj.from_location.id,
                    "name": transfer_obj.from_location.name,
                },
                "from_location": {
                    "id": transfer_obj.from_location.id,
                    "name": transfer_obj.from_location.name,
                },
            }
        except Exception as e:
            return None


class TransferSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    from_location = LocationSerializer(read_only=True)
    from_location_id = serializers.IntegerField(write_only=True)
    to_location = LocationSerializer(read_only=True)
    to_location_id = serializers.IntegerField(write_only=True)
    transfer_items = TransferItemSerializer(read_only=True, many=True, required=False)

    class Meta:
        model = Transfer
        fields = [
            "id",
            "requested_by",
            "approved_by",
            "status",
            "from_location",
            "from_location_id",
            "to_location",
            "to_location_id",
            "requested_date",
            "approved_date",
            "shipment_date",
            "transfer_items",
        ]


class ConsumptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item_id = serializers.IntegerField(write_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = Consumption
        fields = [
            "id",
            "item",
            "item_id",
            "date",
            "reason",
            "quantity",
        ]


class ReturnSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    item_id = serializers.IntegerField(write_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = Return
        fields = [
            "id",
            "item",
            "item_id",
            "date",
            "reason",
            "used",
            "quantity",
        ]
