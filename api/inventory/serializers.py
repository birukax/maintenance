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
    class Meta:
        model = UnitOfMeasure
        fields = [
            "code",
            "name",
        ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            "name",
            "email",
            "phone_no",
            "location",
        ]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "name",
            "uom",
            "type",
            "category",
            "suppliers",
        ]


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
