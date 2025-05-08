from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers
from .models import Plant, Area
from .serializers import PlantSerializer, AreaSerializer


class PlantViewSet(viewsets.ModelViewSet):
    serializer_class = PlantSerializer
    queryset = Plant.objects.all()
    serach_fields = ["code", "name"]
    filterset_fields = []


class AreaViewSet(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    queryset = Area.objects.all()
    search_fields = ["name", "code", "plant__name", "plant__code"]
    filterset_fields = []

    def perform_create(self, serializer):
        plant_id = serializer.validated_data.get("plant_id")
        try:
            plant = Plant.objects.get(id=plant_id)
        except Plant.DoesNotExist:
            raise serializers.ValidationError(
                {"plant_id": f"Plant with id {plant_id} does not exist."}
            )
        serializer.is_valid(raise_exception=True)
        serializer.save(plant=plant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
