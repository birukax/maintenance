from rest_framework import serializers
from .models import Location, Machine, Equipment


class LocationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Location
        fields = [
            "id",
            "code",
            "name",
        ]


class MachineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    location = LocationSerializer(read_only=True)
    location_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Machine
        fields = [
            "id",
            "code",
            "name",
            "location",
            "location_id",
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
