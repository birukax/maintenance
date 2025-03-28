from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
)
from .serializers import (
    UnitOfMeasureSerializer,
    ContactSerializer,
    ItemSerializer,
    InventorySerializer,
    PurchaseScheduleSerializer,
    MonthlyPurchaseScheduleSerializer,
    PurchaseRequestScheduleSerializer,
)


class UnitOfMeasureList(generics.ListCreateAPIView):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitOfMeasureSerializer


class UnitOfMeasureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitOfMeasureSerializer


# @api_view(["GET", "PUT", "DELETE"])
# def uom_detail(request, pk, format=None):
# try:
#     unit_of_measure = UnitOfMeasure.objects.get(pk=pk)
# except UnitOfMeasure.DoesNotExist:
#     return Response(status=status.HTTP_404_NOT_FOUND)

# if request.method == "GET":
#     serializer = UnitOfMeasureSerializer(unit_of_measure)
#     return Response(serializer.data)

# elif request.method == "PUT":
#     serializer = UnitOfMeasureSerializer(unit_of_measure, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# elif request.method == "DELETE":
#     unit_of_measure.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)
