from rest_framework import serializers
from .models import ActivityType, Activity, WorkOrderType, WorkOrder, WorkOrderActivity
from inventory.models import Item
from asset.serializers import MachineSerializer, EquipmentSerializer
from inventory.serializers import ItemSerializer


class WorkOrderTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkOrderType
        fields = [
            "id",
            "code",
            "name",
        ]


class ActivityTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ActivityType
        fields = [
            "id",
            "code",
            "name",
            "work_order_type",
            "work_order_type_id",
        ]


class WorkOrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    machine = MachineSerializer(read_only=True)
    machine_id = serializers.IntegerField(write_only=True)

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.IntegerField(write_only=True)

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.IntegerField(write_only=True)

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)

    materials_required = ItemSerializer(many=True, read_only=True)
    materials_required_id = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True,
        write_only=True,
    )

    tools_required = ItemSerializer(many=True, read_only=True)
    tools_required_id = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True,
        write_only=True,
    )

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "materials_required",
            "materials_required_id",
            "work_order_type",
            "work_order_type_id",
            "activity_type",
            "activity_type_id",
            "tools_required_id",
            "total_time_required",
        ]


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "code",
            "description",
            "activity_type",
        ]


class WorkOrderActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    work_order = WorkOrderSerializer(read_only=True)
    work_order_id = serializers.IntegerField(write_only=True)

    activity = ActivitySerializer(read_only=True)
    activity_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WorkOrderActivity
        fields = [
            "work_order",
            "activity",
            "value",
            "remark",
        ]
