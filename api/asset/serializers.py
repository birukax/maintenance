from rest_framework import serializers
from .models import Location, Machine, Equipment


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            "code",
            "name",
        ]


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = [
            "code",
            "name",
            "location",
        ]


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            "code",
            "name",
            "machine",
        ]
