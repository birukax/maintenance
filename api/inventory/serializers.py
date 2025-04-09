from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_active"]


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
            'id',
            "name",
            "email",
            "phone_no",
            "location",
        ]


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
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


class MonthlyPurchaseScheduleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = MonthlyPurchaseSchedule
        fields = [
            "id",
            "purchase_schedule",
            "month",
            "quantity",
        ]


class PurchaseScheduleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item = ItemSerializer(read_only=True)
    monthly_purchase_schedules = MonthlyPurchaseScheduleSerializer(
        read_only=True, many=True
    )
    class Meta:
        model = PurchaseSchedule
        fields = [
            "id",
            "item",
            "minimum_stock_level",
            "quantity",
            "monthly_purchase_schedules",
        ]


class PurchaseRequestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item_id = serializers.IntegerField(write_only=True)
    item = ItemSerializer(read_only=True)
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            "id",
            "item",
            "item_id",
            "quantity",
            "received_quantity",
            "requested_date",
            "requested_by",
            "approved_by",
            "received_date",
            "priority",
            "status",
        ]

    def create(self, validated_data):
        item_id = validated_data.pop("item_id")
        item = Item.objects.get(id=item_id)
        purchase_request = PurchaseRequest.objects.create(item=item, **validated_data)
        return purchase_request
