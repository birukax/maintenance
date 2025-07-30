import datetime
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Purchase, Transfer
from .serializers import PurchaseSerializer, TransferSerializer


class PurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PurchaseSerializer
    queryset = Purchase.objects.all()
    search_fields = [
        "purchase_request__item__name",
        "by__username",
        "purchase_request__requested_by__username",
        "purchase_request__requested_date",
    ]
    filterset_fields = ["status", "purchase_request__priority"]

    @action(detail=True, methods=["POST"])
    def approve(self, request, pk=None):
        purchase = self.get_object()
        purchase.status = "APPROVED"
        purchase.by = request.user
        purchase.save()
        purchase.purchase_request.approved_date = datetime.date.today
        purchase.purchase_request.status = "APPROVED"
        purchase.purchase_request.approved_by = request.user
        purchase.purchase_request.save()
        serializer = self.get_serializer(purchase)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def reject(self, request, pk=None):
        purchase = self.get_object()
        purchase.status = "REJECTED"
        purchase.by = request.user
        purchase.save()
        purchase.purchase_request.status = "REJECTED"
        purchase.purchase_request.save()
        serializer = self.get_serializer(purchase)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransferViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransferSerializer
    queryset = Transfer.objects.all()

    search_fields = ["transfer__id"]
    filterset_fields = ["status", "transfer__id"]

    @action(detail=True, methods=["POST"])
    def approve(self, request, pk=None):
        transfer = self.get_object()
        transfer.status = "APPROVED"
        transfer.by = request.user
        transfer.remark = request.data.get("remark")
        transfer.save()
        transfer.transfer.approved_date = datetime.date.today
        transfer.transfer.status = "APPROVED"
        transfer.transfer.approved_by = request.user
        transfer.transfer.save()
        serializer = self.get_serializer(transfer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def reject(self, request, pk=None):
        transfer = self.get_object()
        transfer.status = "REJECTED"
        transfer.by = request.user
        transfer.remark = request.data.get("remark")
        transfer.save()
        transfer.transfer.status = "REJECTED"
        transfer.transfer.save()
        serializer = self.get_serializer(transfer)
        return Response(serializer.data, status=status.HTTP_200_OK)
