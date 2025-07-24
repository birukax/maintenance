from rest_framework import serializers
from .models import Breakdown
from asset.models import Machine, Equipment
from asset.serializers import MachineSerializer, EquipmentSerializer


class BreakdownSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    machine = MachineSerializer(read_only=True)
    machine_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Machine.objects.all(), source="machine"
    )
    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Equipment.objects.all(), source="equipment"
    )

    class Meta:
        model = Breakdown
        fields = [
            "id",
            "start_date",
            "end_date",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "reason",
            "remark",
            "status",
            "start_time",
            "end_time",
            "total_time",
        ]
