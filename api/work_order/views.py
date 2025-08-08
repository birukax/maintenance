import datetime
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Activity, ActivityType, WorkOrderActivity, WorkOrder, WorkOrderType
from django.contrib.auth.models import User
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


class ActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
    search_fields = [
        "description",
    ]
    filterset_fields = [
        "schedule__id",
    ]


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
        "schedule__id",
        "breakdown__id",
    ]
    filterset_fields = {
        "status": ["exact"],
        "start_date": ["exact", "gte", "lte"],
        "end_date": ["exact", "gte", "lte"],
    }

    def perform_create(self, serializer):
        start_date = self.request.data.get("start_date")
        total_days = self.request.data.get("total_days")
        total_hours = self.request.data.get("total_hours")
        total_minutes = self.request.data.get("total_minutes")
        total_time_required = datetime.timedelta(
            days=int(total_days) or 0,
            hours=int(total_hours) or 0,
            minutes=int(total_minutes) or 0,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save(
            start_date=start_date,
            total_time_required=total_time_required,
        )

        activities = Activity.objects.filter(
            activity_type=serializer.instance.activity_type
        )
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
        checked_by = request.user
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
            work_order.checked_by = checked_by
            work_order.status = "Checked"
            work_order.save()
        except Exception as e:
            raise serializers.ValidationError(str(e))
        serializer = WorkOrderSerializer(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkOrderActivityVeiwSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderActivitySerializer
    queryset = WorkOrderActivity.objects.all()
    search_fields = ["activity__name", "activity__code"]
    filterset_fields = ["value", "work_order__id"]
