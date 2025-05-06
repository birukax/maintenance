from rest_framework import serializers
from .models import Plant, Area


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
    plant_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Area
        fields = [
            "id",
            "code",
            "name",
            "plant",
            "plant_id",
        ]
