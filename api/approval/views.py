from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Purchase
from .serializers import PurchaseSerializer


class PurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PurchaseSerializer
    queryset = Purchase.objects.all()
    search_fields = [
        "purchase_request__item__name",
        "by",
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
