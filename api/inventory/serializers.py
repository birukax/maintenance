from rest_framework import serializers
from account.serializers import UserSerializer
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    Consumption,
    Return,
)


class UnitOfMeasureSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = UnitOfMeasure
        fields = [
            "id",
            "code",
            "name",
        ]


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
    class Meta:
        model = Inventory
        fields = [
            'id',
            "item",
            "purchased_quantity",
            "consumed_quantity",
            "returned_quantity",
            "balance",
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
