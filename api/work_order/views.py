import datetime
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Activity,
    ActivityType,
    WorkOrderActivity,
    WorkOrder,
    WorkOrderType,
    Clearance,
    WorkOrderClearance,
)
from django.contrib.auth.models import User
from .serializers import (
    ActivitySerializer,
    WorkOrderSerializer,
    ActivityTypeSerializer,
    WorkOrderTypeSerializer,
    WorkOrderActivitySerializer,
    ClearanceSerializer,
    WorkOrderClearanceSerializer,
    SubmitWorkOrderSerializer,
    CompleteWorkOrderSerializer,
)


class ClearanceViewSet(viewsets.ModelViewSet):
    serializer_class = ClearanceSerializer
    queryset = Clearance.objects.all()
    search_fields = ["description"]
    filterset_fields = ["active", "breakdown", "scheduled"]


class WorkOrderTypeViewSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderTypeSerializer
    queryset = WorkOrderType.objects.all()
    search_fields = ["name", "code"]
    filterset_fields = ["scheduled", "breakdown"]


class ActivityTypeViewSet(viewsets.ModelViewSet):
    serializer_class = ActivityTypeSerializer
    queryset = ActivityType.objects.all()
    search_fields = [
        "name",
        "code",
        "work_order_type__name",
        "work_order_type__code",
    ]
    filterset_fields = []


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
    search_fields = [
        "description",
    ]
    filterset_fields = [
        "schedule__id",
    ]


class WorkOrderViewSet(viewsets.ModelViewSet):
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
        "schedule__id": ["exact"],
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
            raise serializers.ValidationError(
                {"error", "Error while creating activities."}
            )

        # serializer = self.serializer_class(self.queryset)
        return Response(status=status.HTTP_200_OK)

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
        serializer = self.serializer_class(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def submit_work_order(self, request, pk=None):
        work_order = self.get_object()
        checked_by = request.user
        try:
            submission_serializer = SubmitWorkOrderSerializer(
                work_order, data=request.data
            )
            submission_serializer.is_valid(raise_exception=True)
            submission_serializer.save()
            work_order.checked_by = checked_by
            work_order.status = "Checked"
            work_order.save()
        except Exception as e:
            raise serializers.ValidationError(
                {"error": "Error while submitting Work Order"}
            )
        serializer = self.serializer_class(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["POST"])
    def complete_work_order(self, request, pk=None):
        work_order = self.get_object()
        completed_by = request.user
        try:
            completion_serializer = CompleteWorkOrderSerializer(
                work_order, data=request.data
            )
            completion_serializer.is_valid(raise_exception=True)
            completion_serializer.save()
            work_order.completed_by = completed_by
            work_order.status = "Completed"
            work_order.save()
        except Exception as e:
            raise serializers.ValidationError(
                {"error": "Error while completing Work Order."}
            )
        serializer = self.serializer_class(work_order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkOrderActivityViewSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderActivitySerializer
    queryset = WorkOrderActivity.objects.all()
    search_fields = ["description", "remark"]
    filterset_fields = ["value", "work_order__id"]


class WorkOrderClearanceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkOrderClearanceSerializer
    queryset = WorkOrderClearance.objects.all()
    search_fields = ["description", "remark"]
    filterset_fields = ["value", "work_order__id"]
