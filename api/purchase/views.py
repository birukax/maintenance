import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from approval.models import Purchase
from inventory.models import Item
from .models import Schedule, Request, Year
from .serializers import (
    ScheduleSerializer,
    RequestSerializer,
    YearSerializer,
)


class YearViewSet(viewsets.ModelViewSet):
    serializer_class = YearSerializer
    queryset = Year.objects.all()


class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    filterset_fields = ["year__no"]

    @action(detail=False, methods=["POST"])
    def create_annual_schedule(self, request):
        year = int(request.data.get("year"))
        try:
            if year is None:
                raise serializers.ValidationError({"year": "Year is required."})
            if Year.objects.filter(year=year).exists():
                raise serializers.ValidationError(
                    {"year": "Schedule already exists for this year."}
                )
            else:
                year_obj = Year(year=year)
                year_obj.save()
            items = Item.objects.all()
            for item in items:
                Schedule.objects.create(item=item, year=year_obj)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        return Response(status=status.HTTP_200_OK)


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    def perform_create(self, serializer):
        item_id = serializer.validated_data.pop("item_id")
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {"item_id": f"Item with id {item_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        purchase_request = serializer.save(
            requested_by=self.request.user,
            item=item,
        )
        Purchase.objects.create(purchase_request=purchase_request)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["PATCH"])
    def receive(self, request, pk=None):
        purchase_request = self.get_object()
        received_quantity = int(request.data.get("received_quantity"))
        received_date = request.data.get("received_date")
        if received_quantity is not None:
            if received_quantity > purchase_request.quantity:
                raise serializers.ValidationError(
                    {
                        "received_quantity": "Received quantity cannot be greater than requested quantity."
                    }
                )
            if received_quantity <= 0:
                raise serializers.ValidationError(
                    {"received_quantity": "Received quantity cannot be less than 1."}
                )

        else:
            raise serializers.ValidationError(
                {"received_quantity": "Received quantity is required."}
            )
        purchase_request.received_quantity = received_quantity
        purchase_request.received_date = received_date
        purchase_request.status = "RECEIVED"
        purchase_request.save()
        serializer = RequestSerializer(purchase_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
