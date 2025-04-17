from rest_framework import serializers
from main.serializers import UserSerializer
from inventory.serializers import ItemSerializer
from asset.serializers import EquipmentSerializer, MachineSerializer
from work_order.serializers import WorkOrderTypeSerializer, ActivityTypeSerializer
from .models import Schedule


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
            "planned_time",
        ]
