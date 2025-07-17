import datetime
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Schedule
from inventory.models import Item
from asset.models import Machine, Equipment
from work_order.models import (
    WorkOrderType,
    ActivityType,
    Activity,
    WorkOrderActivity,
    WorkOrder,
)
from .serializers import ScheduleSerializer


class ScheduleVeiwSet(viewsets.ModelViewSet):
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
        type = self.request.data.get("type")
        description = self.request.data.get("description")
        machine_id = self.request.data.get("machine_id")
        equipment_id = self.request.data.get("equipment_id")
        activity_type_id = self.request.data.get("activity_type_id")
        work_order_type_id = self.request.data.get("work_order_type_id")
        spareparts_required_id = self.request.data.get("spareparts_required_id")
        tools_required_id = self.request.data.get("tools_required_id")
        # planned_time = self.request.data.get("planned_time")
        planned_days = self.request.data.get("planned_days")
        planned_hours = self.request.data.get("planned_hours")
        planned_minutes = self.request.data.get("planned_minutes")
        planned_time = datetime.timedelta(
            days=int(planned_days) or 0,
            hours=int(planned_hours) or 0,
            minutes=int(planned_minutes) or 0,
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
                {"activity_type_id": f"Activity type does not exist."}
            )
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {"work_order_type_id": f"Work order type does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            type=type,
            description=description,
            machine=machine,
            equipment=equipment,
            activity_type=activity_type,
            work_order_type=work_order_type,
            planned_time=planned_time,
        )
        serializer.instance.spareparts_required.set(spareparts_required_id)
        serializer.instance.tools_required.set(tools_required_id)

    @action(detail=True, methods=["POST"])
    def create_work_order(self, request, pk=None):
        schedule = self.get_object()
        start_date = request.data.get("start_date")
        activities = Activity.objects.filter(schedule=schedule, active=True)

        if not activities.exists():
            raise serializers.ValidationError(
                {"error": "There are no active activites for this schedule!"}
            )

        try:
            if (
                WorkOrder.objects.filter(schedule=schedule)
                .exclude(status="Completed")
                .exists()
            ):
                raise serializers.ValidationError(
                    {
                        "error": "Work order already exists for this schedule and start_date."
                    }
                )
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
            for a in activities:
                WorkOrderActivity.objects.create(
                    work_order=work_order,
                    description=a.description,
                )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        serializer = self.serializer_class(schedule)

        return Response(serializer.data, status=status.HTTP_200_OK)
