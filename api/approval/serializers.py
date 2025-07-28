from rest_framework import serializers
from account.serializers import UserSerializer
from purchase.serializers import RequestSerializer
from inventory.serializers import TransferSerializer
from .models import Purchase, Transfer


class PurchaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    purchase_request = RequestSerializer(read_only=True)
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


class TransferSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    transfer = TransferSerializer(read_only=True)
    by = UserSerializer(read_only=True)

    class Meta:
        model = Transfer
        fields = [
            "id",
            "transfer",
            "remark",
            "status",
            "by",
        ]
