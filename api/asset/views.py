from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers
from .models import Location, Machine, Equipment
from .serializers import LocationSerializer, MachineSerializer, EquipmentSerializer


class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()


class MachineViewSet(viewsets.ModelViewSet):
    serializer_class = MachineSerializer
    queryset = Machine.objects.all()

    def perform_create(self, serializer):
        location_id = serializer.validated_data.get("location_id")
        try:
            location = Location.objects.get(id=location_id)
        except Location.DoesNotExist:
            raise serializers.ValidationError(
                {"location_id": f"Location with id {location_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(location=location)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.all()

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
        return Response(serializer.data, status=status.HTTP_200_OK)
