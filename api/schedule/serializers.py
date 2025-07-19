from rest_framework import serializers
from account.serializers import UserSerializer
from inventory.serializers import ItemSerializer
from asset.serializers import EquipmentSerializer, MachineSerializer
from work_order.serializers import (
    WorkOrderTypeSerializer,
    ActivityTypeSerializer,
    ActivitySerializer,
)
from .models import Schedule
from work_order.models import WorkOrder, Activity


class ScheduleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    machine = MachineSerializer(read_only=True)
    machine_id = serializers.IntegerField(write_only=True)

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.IntegerField(write_only=True)

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.IntegerField(write_only=True)

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)

    tools_required = ItemSerializer(many=True, read_only=True)
    spareparts_required = ItemSerializer(many=True, read_only=True)
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Schedule
        fields = [
            "id",
            "type",
            "description",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "work_order_type",
            "work_order_type_id",
            "activity_type",
            "activity_type_id",
            "tools_required",
            "spareparts_required",
            "activities",
            "planned_time",
        ]


class CreateWorkOrderSerializer(serializers.Serializer):
    schedule_id = serializers.IntegerField()
    start_date = serializers.DateField()

    def validate(self, data):
        try:
            schedule = Schedule.objects.get(id=data["schedule_id"])
            start_date = data["start_date"]
        except Schedule.DoesNotExist:
            raise serializers.ValidationError("The schedule can not be found.")
        except Exception as e:
            print(e)
            raise serializers.ValidationError(
                "An unknown error occured while creating the Work Order."
            )
        scheduled_workorders = WorkOrder.objects.filter(schedule=schedule)

        if scheduled_workorders.exclude(status="Completed").exists():
            raise serializers.ValidationError(
                "There's an active work order for this schedule."
            )

        if scheduled_workorders.filter(start_date=start_date).exists():
            raise serializers.ValidationError(
                "Duplicate work order on this date for this schedule."
            )
        if not Activity.objects.filter(schedule=schedule, active=True).exists():
            raise serializers.ValidationError(
                "The schedule must have at least one active activity."
            )
        return data
