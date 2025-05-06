from rest_framework import serializers
from .models import Machine, Equipment
from location.serializers import AreaSerializer


class MachineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    area = AreaSerializer(read_only=True)
    area_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Machine
        fields = [
            "id",
            "code",
            "name",
            "area",
            "area_id",
        ]


class EquipmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    machine = MachineSerializer(read_only=True)
    machine_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Equipment
        fields = [
            "id",
            "code",
            "name",
            "machine",
            "machine_id",
        ]
