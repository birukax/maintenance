import datetime
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Schedule
from work_order.models import WorkOrderActivity, WorkOrder
from .serializers import ScheduleSerializer, CreateWorkOrderSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    search_fields = [
        "machine__name",
        "machine__code",
        "equipment__name",
        "equipment__code",
        "work_order_type__name",
        "work_order_type__code",
        "activity_type__name",
        "activity_type__code",
        "planned_time",
    ]
    filterset_fields = []

    def perform_create(self, serializer):
        planned_days = self.request.data.get("planned_days", 0)
        planned_hours = self.request.data.get("planned_hours", 0)
        planned_minutes = self.request.data.get("planned_minutes", 0)
        planned_time = datetime.timedelta(
            days=int(planned_days) or 0,
            hours=int(planned_hours) or 0,
            minutes=int(planned_minutes) or 0,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(planned_time=planned_time)

    @action(detail=True, methods=["POST"], serializer_class=CreateWorkOrderSerializer)
    def create_work_order(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule_id = serializer.validated_data.pop("schedule_id")
        start_date = serializer.validated_data.pop("start_date")

        try:
            schedule = Schedule.objects.get(id=schedule_id)
            work_order = WorkOrder(
                schedule=schedule,
                start_date=start_date,
                machine=schedule.machine,
                equipment=schedule.equipment,
                work_order_type=schedule.work_order_type,
                activity_type=schedule.activity_type,
                total_time_required=schedule.planned_time,
            )
            work_order.save()
            work_order.tools_required.set(
                [schedule.tools_required.all().values_list("id", flat=True)[0]]
            )
            work_order.spareparts_required.set(
                [schedule.spareparts_required.all().values_list("id", flat=True)[0]]
            )
            for a in schedule.activities.all():
                WorkOrderActivity.objects.create(
                    work_order=work_order,
                    description=a.description,
                )
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                "error while creating scheduled work order."
            )

        return Response(status=status.HTTP_200_OK)
