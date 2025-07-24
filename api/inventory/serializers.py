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
    TransferHistory,
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
    location_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Location.objects.all(), source="location"
    )

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
    shelf_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Shelf.objects.all(), source="shelf"
    )

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
    row = ShelfRowSerializer(read_only=True)
    row_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=ShelfRow.objects.all(), source="row"
    )

    class Meta:
        model = ShelfBox
        fields = [
            "id",
            "row",
            "row_id",
            "code",
            "name",
        ]


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
    uom_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=UnitOfMeasure.objects.all(), source="uom"
    )
    shelf = ShelfSerializer(read_only=True)
    shelf_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Shelf.objects.all(), source="shelf"
    )
    row = ShelfRowSerializer(read_only=True)
    row_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=ShelfRow.objects.all(), source="row"
    )
    box = ShelfBoxSerializer(read_only=True)
    box_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=ShelfBox.objects.all(), source="box"
    )
    # inventory = serializers.SerializerMethodField(read_only=True)
    suppliers = ContactSerializer(read_only=True, many=True, required=False)
    suppliers_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Contact.objects.all(),
        many=True,
        source="suppliers",
        required=False,
    )

    class Meta:
        model = Item
        fields = [
            "id",
            "no",
            "name",
            "shelf",
            "shelf_id",
            "row",
            "row_id",
            "box",
            "box_id",
            "uom",
            "uom_id",
            # "inventory",
            "minimum_stock_level",
            "type",
            "category",
            "suppliers",
            "suppliers_id",
        ]

    # def get_inventory(self, obj):
    #     try:
    #         inventory_obj = obj.inventory
    #         return {"id": inventory_obj.id, "balance": inventory_obj.balance}
    #         # return InventorySerializer(inventory_obj, context=self.context).data
    #     except Inventory.DoesNotExist:
    #         return None


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
            "shipped_quantity",
            "received_quantity",
            "total_shipped_quantity",
            "remaining_quantity",
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
    from_location_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Location.objects.all(), source="from_location"
    )
    to_location = LocationSerializer(read_only=True)
    to_location_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Location.objects.all(), source="to_location"
    )
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


class TransferHistorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    transfer = TransferSerializer(read_only=True)
    item = ItemSerializer(read_only=True)
    location = LocationSerializer(read_only=True)

    class Meta:
        model = TransferHistory
        fields = [
            "id",
            "transfer",
            "item",
            "location",
            "type",
            "date",
            "quantity",
            "completed",
        ]


class ConsumptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Item.objects.all(), source="item"
    )
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
    item_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Item.objects.all(), source="item"
    )
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
