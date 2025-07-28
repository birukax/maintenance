import datetime
from django.db.models import Sum
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from approval.models import Purchase
from inventory.models import Item, Location
from .models import Schedule, Request, Year, RequestItem, PurchaseHistory
from .serializers import (
    ScheduleSerializer,
    RequestSerializer,
    YearSerializer,
)


class YearViewSet(viewsets.ModelViewSet):
    serializer_class = YearSerializer
    queryset = Year.objects.all()
    search_fields = ["no"]
    filterset_fields = ["no"]


class RequestViewSet(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()
    search_fields = [
        "item__name",
        "item__no",
        "quantity",
        "received_quantity",
        "requested_date",
        "received_date",
        "requested_by__username",
        "approved_by__username",
    ]
    filterset_fields = ["status", "priority"]

    def perform_create(self, serializer):
        requested_items = self.request.data.get("requested_items")

        for i in requested_items:
            if i["quantity"] is None or i["quantity"] <= 0 or i["quantity"] == "":
                raise serializers.ValidationError({"error": "Invalid Quantity"})
            if not Item.objects.filter(id=i["item_id"]).exists():
                raise serializers.ValidationError(
                    {
                        "item_id",
                        f"Item Does not exist!",
                    },
                )
        try:
            serializer.is_valid(raise_exception=True)
            instance = serializer.save(requested_by=self.request.user)

            request_item_list = [
                RequestItem(
                    request=instance,
                    item=Item.objects.get(id=i["item_id"]),
                    requested_quantity=i["quantity"],
                )
                for i in requested_items
            ]
            RequestItem.objects.bulk_create(request_item_list)
            Purchase.objects.create(purchase_request=instance)
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                {"error": "Error while creating purchase request."}
            )
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["PATCH"])
    def receive(self, request, pk=None):
        instance = self.get_object()
        received_quantity = int(request.data.get("received_quantity"))
        received_date = request.data.get("received_date")
        location_id = request.data.get("location_id")
        try:
            location = Location.objects.get(id=location_id)
        except Location.DoesNotExist:
            raise serializers.ValidationError(
                {"location_id": f"Location does not exist."}
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        if received_quantity is not None:
            if received_quantity > instance.quantity:
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
        instance.received_quantity = received_quantity
        instance.received_date = received_date
        instance.status = "RECEIVED"
        instance.location = location
        instance.save()
        serializer = RequestSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    search_fields = [
        "item__name",
        "item__no",
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
    filterset_fields = ["year__no"]

    @action(detail=False, methods=["POST"])
    def create_annual_schedule(self, request):
        year = request.data.get("year")
        try:
            if year is None:
                raise serializers.ValidationError({"year": "Year is required."})
            if Year.objects.filter(no=year).exists():
                raise serializers.ValidationError(
                    {"year": "Schedule already exists for this year."}
                )
            else:
                year_obj = Year(no=year)
                year_obj.save()
            items = Item.objects.all()
            for item in items:
                Schedule.objects.create(item=item, year=year_obj)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        return Response(status=status.HTTP_200_OK)
