from rest_framework import serializers
from inventory.serializers import ItemSerializer
from asset.serializers import EquipmentSerializer, MachineSerializer
from work_order.serializers import (
    WorkOrderTypeSerializer,
    WorkOrderType,
    ActivityTypeSerializer,
    ActivitySerializer,
)
from .models import Schedule
from work_order.models import WorkOrder, Activity, ActivityType
from asset.models import Machine, Equipment
from inventory.models import Item
from main.choices import SCHEDULE_TYPES


class ScheduleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.ChoiceField(choices=SCHEDULE_TYPES)
    description = serializers.CharField()
    machine = MachineSerializer(read_only=True)
    machine_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Machine.objects.all(), source="machine"
    )

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Equipment.objects.all(),
        required=False,
        allow_null=True,
        source="equipment",
    )

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=WorkOrderType.objects.all(), source="work_order_type"
    )

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=ActivityType.objects.all(),
        required=False,
        allow_null=True,
        source="activity_type",
    )
    tools_required = ItemSerializer(many=True, read_only=True)
    tools_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="TOOL"),
        many=True,
        source="tools_required",
        required=False,
    )
    spareparts_required = ItemSerializer(many=True, read_only=True)
    spareparts_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="SPAREPART"),
        many=True,
        source="spareparts_required",
        required=False,
    )
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Schedule
        fields = [
            "id",
            "type",
            "is_complete",
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
            "tools_required_id",
            "spareparts_required",
            "spareparts_required_id",
            "activities",
            "planned_time",
            "total_work_orders",
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
