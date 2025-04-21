from rest_framework import serializers
from main.serializers import UserSerializer
from inventory.serializers import PurchaseRequestSerializer
from .models import Purchase


class PurchaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    purchase_request = PurchaseRequestSerializer(read_only=True)
    by = UserSerializer(read_only=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "purchase_request",
            "remark",
            "status",
            "by",
        ]
