from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers
from .models import Machine, Equipment
from location.models import Area
from .serializers import MachineSerializer, EquipmentSerializer


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

    def perform_create(self, serializer):
        area_id = serializer.validated_data.get("area_id")
        try:
            area = Area.objects.get(id=area_id)
        except Area.DoesNotExist:
            raise serializers.ValidationError(
                {"area_id": f"Area with id {area_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(area=area)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

    def perform_create(self, serializer):
        machine_id = serializer.validated_data.get("machine_id")
        try:
            machine = Machine.objects.get(id=machine_id)
        except Machine.DoesNotExist:
            raise serializers.ValidationError(
                {"machine_id": f"Machine with id {machine_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(machine=machine)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
