from rest_framework import serializers
from account.serializers import UserSerializer
from inventory.serializers import ItemSerializer, LocationSerializer
from .models import (
    Schedule,
    Request,
    Year,
    RequestItem,
    PurchaseHistory,
)
from inventory.models import Item, Location


class YearSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Year
        fields = ["id", "no"]


class ScheduleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item = ItemSerializer(read_only=True)
    year = YearSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = [
            "id",
            "item",
            "year",
            "balance",
            "quantity",
            "purchased_quantity",
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
        ]


class RequestItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item = ItemSerializer(read_only=True)
    request = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RequestItem
        fields = [
            "id",
            "request",
            "item",
            "requested_quantity",
            "received_quantity",
            "remaining_quantity",
        ]

    def get_request(self, obj):
        try:
            request_obj = obj.request
            return {
                "id": request_obj.id,
                "location": {
                    "id": request_obj.location.id,
                    "code": request_obj.location.code,
                    "name": request_obj.location.name,
                },
            }
        except Exception as e:
            return None


class RequestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Location.objects.all(), source="location"
    )
    request_items = RequestItemSerializer(many=True, read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "requested_by",
            "approved_by",
            "location",
            "location_id",
            "requested_date",
            "approved_date",
            "priority",
            "status",
            "request_items",
        ]


class PurchaseHistorySerializer(serializers.ModelSerializer):
    request = RequestSerializer(read_only=True)
    item = ItemSerializer(read_only=True)
    location = LocationSerializer(read_only=True)

    class Meta:
        model = PurchaseHistory
        fields = [
            "id",
            "date",
            "quantity",
            "request",
            "item",
            "location",
        ]
        read_only_fields = ["id", "date", "quantity"]
