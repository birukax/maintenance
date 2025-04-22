from rest_framework import serializers
from .models import ActivityType, Activity, WorkOrderType, WorkOrder, WorkOrderActivity
from inventory.models import Item
from asset.serializers import MachineSerializer, EquipmentSerializer
from inventory.serializers import ItemSerializer
from main.serializers import UserSerializer
from schedule.models import Schedule

class WorkOrderTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkOrderType
        fields = [
            "id",
            "code",
            "scheduled",
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
            if activity_obj == None:
                return None
            return {
                "id": activity_obj.id,
                "name": activity_obj.name,
                "code": activity_obj.code,
                "description": activity_obj.description,
            }
        except Activity.DoesNotExist:
            return None

    def get_work_order(self, obj):
        try:

            work_order_obj = obj.work_order

            if work_order_obj == None:
                return None
            return {
                "id": work_order_obj.id,
            }
        except WorkOrder.DoesNotExist:
            return None


class WorkOrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    schedule = serializers.SerializerMethodField(read_only=True)

    machine = MachineSerializer(read_only=True)
    machine_id = serializers.IntegerField(write_only=True)

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.IntegerField(write_only=True)

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.IntegerField(write_only=True)

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)

    completed_by = UserSerializer(read_only=True)
    completed_by_id = serializers.IntegerField(write_only=True)

    spareparts_required = ItemSerializer(many=True, read_only=True)
    tools_required = ItemSerializer(many=True, read_only=True)
    work_order_activities = WorkOrderActivitySerializer(many=True, read_only=True)
    assigned_users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "date",
            "schedule",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "activity_type",
            "activity_type_id",
            "work_order_type",
            "work_order_type_id",
            "completed_by",
            "completed_by_id",
            "tools_required",
            "total_time_required",
            "spareparts_required",
            "work_order_activities",
            "assigned_users",
        ]

    def get_schedule(self, obj):
        try:
            schedule_obj = obj.schedule
            if schedule_obj == None:
                return None
            return {
                "id": schedule_obj.id,
                "type": schedule_obj.type,
                "description": schedule_obj.description,
            }
        except Schedule.DoesNotExist:
            return None


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "code",
            "name",
            "description",
            "activity_type",
            "activity_type_id",
        ]
