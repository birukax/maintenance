from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Activity, ActivityType, WorkOrderActivity, WorkOrder
from .serializers import (
    ActivitySerializer,
    ActivityTypeSerializer,
    WorkOrderActivitySerializer,
    WorkOrderSerializer,
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
