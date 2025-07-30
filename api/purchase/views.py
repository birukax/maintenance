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
    RequestItemSerializer,
    PurchaseHistorySerializer,
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
        date = request.data.get("date")
        received_items = request.data.get("received_items")
        if not received_items:
            raise serializers.ValidationError({"error": "Nothing to Receive."})
        if not date:
            raise serializers.ValidationError({"date": "Date is required."})
        # else:
        #     date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        try:
            received_list = []
            for i in received_items:
                item = Item.objects.get(id=i["item_id"])
                request_item = RequestItem.objects.get(request=instance, item=item)
                if (request_item.remaining_quantity) < int(i["quantity"]):
                    raise serializers.ValidationError(
                        {"error": "The quantity is not valid."}
                    )
                if int(i["quantity"]) > 0:
                    received_list.append(
                        PurchaseHistory(
                            request=instance,
                            item=item,
                            date=date,
                            location=instance.location,
                            quantity=int(i["quantity"]),
                        )
                    )
            if received_list:
                PurchaseHistory.objects.bulk_create(received_list)
        except RequestItem.DoesNotExist:
            raise serializers.ValidationError({"error": "Item not found."})
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "One or more items do not exist."}
            )
        except Exception as e:
            print(e)
            raise serializers.ValidationError({"error", "Error while receiving."})

        serializer = RequestSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RequestItemViewSet(viewsets.ModelViewSet):
    serializer_class = RequestItemSerializer
    queryset = RequestItem.objects.all()
    search_fields = [
        "item__no",
        "item__name",
    ]
    filterset_fields = []


class PurchaseHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseHistorySerializer
    queryset = PurchaseHistory.objects.all()
    serach_fields = [
        "item__no",
        "item__name",
        "location__code",
        "location_name",
    ]
    filterset_fields = [
        "date",
    ]


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
