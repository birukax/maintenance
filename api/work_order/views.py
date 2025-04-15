from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Activity, ActivityType, WorkOrderActivity, WorkOrder, WorkOrderType
from .serializers import (
    ActivitySerializer,
    WorkOrderSerializer,
    ActivityTypeSerializer,
    WorkOrderTypeSerializer,
    WorkOrderActivitySerializer,
)


class ActivityTypeVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivityTypeSerializer
    queryset = ActivityType.objects.all()


class ActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()


class WorkOrderVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.all()

class WorkOrderActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderActivitySerializer
    queryset = WorkOrderActivity.objects.all()


class WorkOrderTypeVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderTypeSerializer
    queryset = WorkOrderType.objects.all()
