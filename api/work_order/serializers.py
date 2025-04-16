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


class WorkOrderActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    work_order = serializers.SerializerMethodField(read_only=True)
    activity = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = WorkOrderActivity
        fields = [
            "id",
            "value",
            "remark",
            "activity",
            "work_order",
        ]

    def get_activity(self, obj):
        try:
            activity_obj = obj.activity
            return {
                "id": activity_obj.id,
                "code": activity_obj.code,
                "description": activity_obj.description,
            }
        except Activity.DoesNotExist:
            return None

    def get_work_order(self, obj):
        try:
            work_order_obj = obj.work_order
            return {
                "id": work_order_obj.id,
            }
        except WorkOrder.DoesNotExist:
            return None


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

    spareparts_required = ItemSerializer(many=True, read_only=True)
    tools_required = ItemSerializer(many=True, read_only=True)
    work_order_activities = WorkOrderActivitySerializer(many=True, read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "date",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "activity_type",
            "activity_type_id",
            "work_order_type",
            "work_order_type_id",
            "tools_required",
            "total_time_required",
            "spareparts_required",
            "work_order_activities",
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
            "activity_type_id",
        ]
