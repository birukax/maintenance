from rest_framework import serializers
from .models import Breakdown
from asset.serializers import MachineSerializer, EquipmentSerializer


class BreakdownSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    machine = MachineSerializer(read_only=True)
    machine_id = serializers.IntegerField(write_only=True)
    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.IntegerField(write_only=True)

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
