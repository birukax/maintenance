from rest_framework import serializers
from account.serializers import UserSerializer
from purchase.serializers import RequestSerializer
from .models import Purchase


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
