import datetime
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Activity, ActivityType, WorkOrderActivity, WorkOrder, WorkOrderType
from asset.models import Machine, Equipment
from inventory.models import Item
from .serializers import (
    ActivitySerializer,
    WorkOrderSerializer,
    ActivityTypeSerializer,
    WorkOrderTypeSerializer,
    WorkOrderActivitySerializer,
)


class WorkOrderTypeVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderTypeSerializer
    queryset = WorkOrderType.objects.all()


class ActivityTypeVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivityTypeSerializer
    queryset = ActivityType.objects.all()

    def perform_create(self, serializer):
        work_order_type_id = self.request.data.get("work_order_type_id")
        try:
            work_order_type = WorkOrderType.objects.get(id=work_order_type_id)
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_type_id": f"Work order type with id {work_order_type_id} does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(work_order_type=work_order_type)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()

    def perform_create(self, serializer):
        activity_type_id = self.request.data.get("activity_type_id")
        try:
            activity_type = ActivityType.objects.get(id=activity_type_id)
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "activity_type_id": f"Activity type with id {activity_type_id} does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(activity_type=activity_type)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WorkOrderVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.all()
    def perform_create(self, serializer):
        machine_id = self.request.data.get("machine_id")
        equipment_id = self.request.data.get("equipment_id")
        activity_type_id = self.request.data.get("activity_type_id")
        work_order_type_id = self.request.data.get("work_order_type_id")
        spareparts_required_id = self.request.data.get("spareparts_required_id")
        tools_required_id = self.request.data.get("tools_required_id")
        work_order_date = self.request.data.get("date")
        toal_time_required = self.request.data.get("total_time_required")
        toal_time_required = datetime.timedelta(minutes=int(toal_time_required))
        if work_order_date:
            try:
                work_order_date = datetime.datetime.fromisoformat(
                    work_order_date.replace("Z", "+00:00")
                ).date()
            except ValueError:
                work_order_date = datetime.datetime.strptime(
                    work_order_date, "%Y-%m-%d"
                ).date()
        else:
            work_order_date = datetime.date.today()
        try:
            if machine_id:
                machine = Machine.objects.get(id=machine_id)
            if equipment_id:
                equipment = Equipment.objects.get(id=equipment_id)
            if activity_type_id:
                activity_type = ActivityType.objects.get(id=activity_type_id)
            if work_order_type_id:
                work_order_type = WorkOrderType.objects.get(id=work_order_type_id)
        except Machine.DoesNotExist:
            raise serializers.ValidationError(
                {"machine_id": f"Machine with id {machine_id} does not exist."}
            )
        except Equipment.DoesNotExist:
            raise serializers.ValidationError(
                {"equipment_id": f"Equipment with id {equipment_id} does not exist."}
            )
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "activity_type_id": f"Activity type with id {activity_type_id} does not exist."
                }
            )
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_type_id": f"Work order type with id {work_order_type_id} does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            machine=machine,
            equipment=equipment,
            activity_type=activity_type,
            work_order_type=work_order_type,
            date=work_order_date,
            total_time_required=toal_time_required,
        )
        serializer.instance.spareparts_required.set(spareparts_required_id)
        serializer.instance.tools_required.set(tools_required_id)
        activities = Activity.objects.filter(activity_type=activity_type)
        if activities.exists:
            for a in activities:
                WorkOrderActivity.objects.create(
                    work_order=serializer.instance,
                    activity=a,
                )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["POST"])
    def create_activities(self, request, pk=None):
        work_order = self.get_object()
        activity_ids = request.data.get("activity_ids")
        try:
            for a in activity_ids:
                activity = Activity.objects.get(id=a)

                WorkOrderActivity.objects.create(
                    work_order=work_order,
                    activity=activity,
                )
        except Activity.DoesNotExist:
            raise serializers.ValidationError(
                {"activity_ids": f"Activity does not exist."}
            )
        serializer = WorkOrderSerializer(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkOrderActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderActivitySerializer
    queryset = WorkOrderActivity.objects.all()
    def perform_create(self, serializer):
        activity_id = self.request.data.get("activity_id")
        work_order_id = self.request.data.get("work_order_id")
        try:
            if activity_id:
                activity = ActivityType.objects.get(id=activity_id)
            if work_order_id:
                work_order = WorkOrderType.objects.get(id=work_order_id)
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError(
                {"activity_id": f"Activity type with id {activity_id} does not exist."}
            )
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_id": f"Work order type with id {work_order_id} does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            activity=activity,
            work_order=work_order,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
