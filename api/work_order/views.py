import datetime
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Activity, ActivityType, WorkOrderActivity, WorkOrder, WorkOrderType
from django.contrib.auth.models import User
from asset.models import Machine, Equipment
from inventory.models import Item
from schedule.models import Schedule
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
    search_fields = ["name", "code"]
    filterset_fields = ["scheduled", "breakdown"]


class ActivityTypeVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivityTypeSerializer
    queryset = ActivityType.objects.all()
    search_fields = [
        "name",
        "code",
        "work_order_type__name",
        "work_order_type__code",
    ]
    filterset_fields = []

    def perform_create(self, serializer):
        work_order_type_id = self.request.data.get("work_order_type_id")
        try:
            work_order_type = WorkOrderType.objects.get(id=work_order_type_id)
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {"work_order_type_id": f"Work order type does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(work_order_type=work_order_type)


class ActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
    search_fields = [
        "description",
    ]
    filterset_fields = [
        "schedule__id",
    ]

    def perform_create(self, serializer):
        schedule_id = self.request.data.get("schedule_id")
        try:
            schedule = Schedule.objects.get(id=schedule_id)
        except Schedule.DoesNotExist:
            raise serializers.ValidationError(
                {"schedule_id": f"Schedule does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(schedule=schedule)


class WorkOrderVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.all()
    search_fields = [
        "machine__name",
        "machine__code",
        "equipment__name",
        "equipment__code",
        "work_order_type__name",
        "work_order_type__code",
        "activity_type__name",
        "activity_type__code",
        "completed_by__username",
        "start_date",
        "start_time",
        "end_date",
        "end_time",
        "total_time_required",
    ]
    filterset_fields = ["status"]

    def perform_create(self, serializer):
        machine_id = self.request.data.get("machine_id")
        equipment_id = self.request.data.get("equipment_id")
        activity_type_id = self.request.data.get("activity_type_id")
        work_order_type_id = self.request.data.get("work_order_type_id")
        spareparts_required_id = self.request.data.get("spareparts_required_id")
        tools_required_id = self.request.data.get("tools_required_id")
        start_date = self.request.data.get("start_date")
        # total_time_required = self.request.data.get("total_time_required")
        total_days = self.request.data.get("total_days")
        total_hours = self.request.data.get("total_hours")
        total_minutes = self.request.data.get("total_minutes")
        total_time_required = datetime.timedelta(
            days=int(total_days) or 0,
            hours=int(total_hours) or 0,
            minutes=int(total_minutes) or 0,
        )

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
                {"machine_id": f"Machine does not exist."}
            )
        except Equipment.DoesNotExist:
            raise serializers.ValidationError(
                {"equipment_id": f"Equipment does not exist."}
            )
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "activity_type_id": f"Activity type does not exist."
                }
            )
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_type_id": f"Work order type does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            machine=machine,
            equipment=equipment,
            activity_type=activity_type,
            work_order_type=work_order_type,
            start_date=start_date,
            total_time_required=total_time_required,
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

    @action(detail=True, methods=["POST"])
    def create_activities(self, request, pk=None):
        work_order = self.get_object()
        if work_order.work_order_type.scheduled:
            raise serializers.ValidationError({"error": "Invalid Work Order Type."})

        try:
            description_list = request.data.get("description_list")
            for d in description_list:
                WorkOrderActivity.objects.create(
                    work_order=work_order,
                    description=d,
                )
        except Exception as e:
            raise serializers.ValidationError({"error", str(e)})
        serializer = self.serializer_class(self.queryset)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def assign_users(self, request, pk=None):
        work_order = self.get_object()
        user_ids = request.data.get("user_ids")
        try:
            users = User.objects.filter(id__in=user_ids)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_ids": f"User does not exist."})
        if users.exists():
            work_order.status = "Assigned"
        else:
            work_order.status = "Created"
        work_order.assigned_users.set(users)
        work_order.save()
        serializer = WorkOrderSerializer(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def submit_work_order(self, request, pk=None):
        work_order = self.get_object()
        remark = request.data.get("remark")
        completed_by = request.user
        try:
            start_time = datetime.time(
                *map(int, request.data.get("start_time").split(":"))
            )
            end_date = datetime.date(*map(int, request.data.get("end_date").split("-")))
            end_time = datetime.time(*map(int, request.data.get("end_time").split(":")))
        except Exception as e:
            raise serializers.ValidationError(str(e))
        try:
            start = datetime.datetime.combine(work_order.start_date, start_time)
            end = datetime.datetime.combine(end_date, end_time)
            if end < start:
                raise serializers.ValidationError(
                    {"end_time": "End time cannot be before start time."}
                )
        except Exception as e:
            raise serializers.ValidationError(str(e))
        try:
            work_order.start_time = start_time
            work_order.end_date = end_date
            work_order.end_time = end_time
            work_order.remark = remark
            work_order.completed_by = completed_by
            work_order.status = "Completed"
            work_order.save()
        except Exception as e:
            raise serializers.ValidationError(str(e))
        serializer = WorkOrderSerializer(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkOrderActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderActivitySerializer
    queryset = WorkOrderActivity.objects.all()
    search_fields = ["activity__name", "activity__code"]
    filterset_fields = ["value", 'work_order__id']

    def perform_create(self, serializer):
        work_order_id = self.request.data.get("work_order_id")
        try:
            if work_order_id:
                work_order = WorkOrder.objects.get(id=work_order_id)
        except WorkOrder.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_id": f"Work order does not exist."
                }
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            work_order=work_order,
        )
