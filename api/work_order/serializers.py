from rest_framework import serializers
from .models import ActivityType, Activity, WorkOrderType, WorkOrder, WorkOrderActivity
from inventory.models import Item
from asset.serializers import MachineSerializer, EquipmentSerializer
from inventory.serializers import ItemSerializer
from account.serializers import UserSerializer
from asset.models import Machine, Equipment
from schedule.models import Schedule
from breakdown.models import Breakdown


class WorkOrderTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = WorkOrderType
        fields = [
            "id",
            "code",
            "scheduled",
            "breakdown",
            "name",
        ]


class ActivityTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=WorkOrderType.objects.all(), source="work_order_type"
    )

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
    work_order_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=WorkOrder.objects.all(), source="work_order"
    )

    class Meta:
        model = WorkOrderActivity
        fields = [
            "id",
            "value",
            "remark",
            "description",
            "work_order",
            "work_order_id",
        ]

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
    breakdown = serializers.SerializerMethodField(read_only=True)

    machine = MachineSerializer(read_only=True)
    machine_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Machine.objects.all(), source="machine"
    )

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Equipment.objects.all(), source="equipment"
    )

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=WorkOrderType.objects.all(), source="work_order_type"
    )

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=ActivityType.objects.all(), source="activity_type"
    )

    completed_by = UserSerializer(read_only=True)

    spareparts_required = ItemSerializer(many=True, read_only=True)
    tools_required = ItemSerializer(many=True, read_only=True)
    tools_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="TOOL"),
        many=True,
        source="tools_required",
        required=False,
    )
    spareparts_required = ItemSerializer(many=True, read_only=True)
    spareparts_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="SPAREPART"),
        many=True,
        source="spareparts_required",
        required=False,
    )
    assigned_users = UserSerializer(many=True, read_only=True)
    work_order_activities = WorkOrderActivitySerializer(many=True, read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "start_date",
            "start_time",
            "end_date",
            "end_time",
            "schedule",
            "status",
            "remark",
            "breakdown",
            "machine",
            "machine_id",
            "equipment",
            "equipment_id",
            "activity_type",
            "activity_type_id",
            "work_order_type",
            "work_order_type_id",
            "completed_by",
            "total_time_required",
            "total_time_taken",
            "tools_required",
            "tools_required_id",
            "spareparts_required",
            "spareparts_required_id",
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

    def get_breakdown(self, obj):
        try:
            breakdown_obj = obj.breakdown
            if breakdown_obj == None:
                return None
            return {
                "id": breakdown_obj.id,
                "reason": breakdown_obj.reason,
            }
        except Breakdown.DoesNotExist:
            return None


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    schedule_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Schedule.objects.all(), source="schedule"
    )

    class Meta:
        model = Activity
        fields = [
            "id",
            "description",
            "active",
            "schedule",
            "schedule_id",
        ]
