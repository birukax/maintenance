from rest_framework import serializers
from .models import Machine, Equipment, Plant, Area


class PlantSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Plant
        fields = [
            "id",
            "code",
            "name",
        ]


class AreaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    plant = PlantSerializer(read_only=True)
    plant_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Plant.objects.all(), source="plant"
    )

    class Meta:
        model = Area
        fields = [
            "id",
            "code",
            "name",
            "plant",
            "plant_id",
        ]


class MachineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    area = AreaSerializer(read_only=True)
    area_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Area.objects.all(), source="area"
    )

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
    machine_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Machine.objects.all(), source="machine"
    )

    class Meta:
        model = Equipment
        fields = [
            "id",
            "code",
            "name",
            "machine",
            "machine_id",
        ]
