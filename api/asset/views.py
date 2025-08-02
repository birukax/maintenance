from rest_framework import viewsets
from .models import Machine, Equipment, Plant, Area
from .serializers import (
    MachineSerializer,
    EquipmentSerializer,
    PlantSerializer,
    AreaSerializer,
)


class PlantViewSet(viewsets.ModelViewSet):
    serializer_class = PlantSerializer
    queryset = Plant.objects.all()
    search_fields = [
        "code",
        "name",
    ]
    filterset_fields = []


class AreaViewSet(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    queryset = Area.objects.all()
    search_fields = [
        "name",
        "code",
        "plant__name",
        "plant__code",
    ]
    filterset_fields = []


class MachineViewSet(viewsets.ModelViewSet):
    serializer_class = MachineSerializer
    queryset = Machine.objects.all()

    search_fields = [
        "code",
        "name",
        "area__name",
        "area__code",
    ]
    filterset_fields = []


class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()

    search_fields = [
        "code",
        "name",
        "machine__name",
        "machine__code",
    ]
    filterset_fields = []
