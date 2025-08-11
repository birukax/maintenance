import datetime
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Schedule
from work_order.serializers import CreateWorkOrderSerializer
from .serializers import ScheduleSerializer


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

    @action(detail=True, methods=["POST"])
    def create_work_order(self, request, pk=None):
        schedule = self.get_object()
        try:
            request_data = request.data.copy()
            request_data["schedule_id"] = schedule.id
            create_wo_serializer = CreateWorkOrderSerializer(data=request_data)
            create_wo_serializer.is_valid(raise_exception=True)
            create_wo_serializer.save()
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                {"error", "Error while creating scheduled work order."}
            )
        return Response(status=status.HTTP_200_OK)
