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

    def perform_create(self, serializer):
        type = self.request.data.get("type")
        description = self.request.data.get("description")
        machine_id = self.request.data.get("machine_id")
        equipment_id = self.request.data.get("equipment_id")
        activity_type_id = self.request.data.get("activity_type_id")
        work_order_type_id = self.request.data.get("work_order_type_id")
        spareparts_required_id = self.request.data.get("spareparts_required_id")
        tools_required_id = self.request.data.get("tools_required_id")
        planned_time = self.request.data.get("planned_time")
        planned_time = datetime.timedelta(minutes=int(planned_time))
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["POST"])
    def create_work_order(self, request, pk=None):
        schedule = self.get_object()
        date = request.data.get("date")

        try:
            if WorkOrder.objects.filter(schedule=schedule, date=date).exists():
                raise serializers.ValidationError(
                    {"date": "Work order already exists for this schedule and date."}
                )
            work_order = WorkOrder(
                schedule=schedule,
                date=date,
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

        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        serializer = ScheduleSerializer(schedule)
        return Response(serializer.data, status=status.HTTP_200_OK)
