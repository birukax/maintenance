from rest_framework import serializers
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
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
            "name",
            "email",
            "phone_no",
            "location",
        ]


class ItemSerializer(serializers.ModelSerializer):
    uom = UnitOfMeasureSerializer(read_only=True)
    uom_id = serializers.IntegerField(write_only=True)
    suppliers = ContactSerializer(read_only=True, many=True, required=False)

    class Meta:
        model = Item
        fields = [
            'id',
            "no",
            "name",
            "uom",
            "uom_id",
            "type",
            "category",
            "suppliers",
        ]

    def create(self, validated_data):
        uom_id = validated_data.pop("uom_id")
        uom = UnitOfMeasure.objects.get(id=uom_id)
        item = Item.objects.create(uom=uom, **validated_data)
        return item


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = [
            "item",
            "purchased_quantity",
            "consumed_quantity",
            "returned_quantity",
            "balance",
        ]


class PurchaseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseSchedule
        fields = [
            "item",
            "minimum_stock_level",
            "quantity",
        ]


class MonthlyPurchaseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyPurchaseSchedule
        fields = [
            "purchase_schedule",
            "month",
            "quantity",
        ]


class PurchaseRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseRequest
        fields = [
            "item",
            "quantity",
            "received_quantity",
            "requested_date",
            "requested_by",
            "approved_by",
            "received_date",
            "priority",
            "status",
        ]
