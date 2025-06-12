from rest_framework import serializers
from account.serializers import UserSerializer
from inventory.serializers import ItemSerializer, LocationSerializer
from .models import (
    Schedule,
    Request,
    Year,
)


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


class RequestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    item_id = serializers.IntegerField(write_only=True)
    item = ItemSerializer(read_only=True)
    location_id = serializers.IntegerField(write_only=True, required=False)
    location = LocationSerializer(read_only=True)
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "item",
            "item_id",
            "location",
            "location_id",
            "quantity",
            "received_quantity",
            "requested_date",
            "requested_by",
            "approved_by",
            "received_date",
            "priority",
            "status",
        ]
