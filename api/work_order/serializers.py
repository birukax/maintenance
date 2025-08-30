import datetime
from rest_framework import serializers
from .models import (
    ActivityType,
    Activity,
    WorkOrderType,
    WorkOrder,
    WorkOrderActivity,
    Clearance,
    WorkOrderClearance,
)
from inventory.models import Item
from asset.serializers import MachineSerializer, EquipmentSerializer
from inventory.serializers import ItemSerializer
from account.serializers import UserSerializer
from asset.models import Machine, Equipment
from schedule.models import Schedule
from breakdown.models import Breakdown


class ClearanceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Clearance
        fields = [
            "id",
            "description",
            "active",
            "breakdown",
            "scheduled",
        ]


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


class WorkOrderClearanceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    work_order = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = WorkOrderClearance
        fields = [
            "id",
            "description",
            "value",
            "remark",
            "work_order",
        ]
        read_only_fields = ["description", "work_order"]

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


class CreateWorkOrderSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField()
    breakdown_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Breakdown.objects.exclude(status="FIXED"),
        source="breakdown",
        required=False,
    )
    schedule_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Schedule.objects.all(),
        source="schedule",
        required=False,
    )
    work_order_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=WorkOrderType.objects.all(),
        source="work_order_type",
        required=False,
    )
    activity_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=ActivityType.objects.all(),
        source="activity_type",
        required=False,
    )
    tools_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="TOOL"),
        many=True,
        source="tools_required",
        required=False,
    )
    spareparts_required_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Item.objects.filter(category="SPAREPART"),
        many=True,
        source="spareparts_required",
        required=False,
    )
    total_days = serializers.IntegerField(write_only=True, required=False)
    total_hours = serializers.IntegerField(write_only=True, required=False)
    total_minutes = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = WorkOrder
        fields = [
            "start_date",
            "breakdown_id",
            "schedule_id",
            "work_order_type_id",
            "activity_type_id",
            "tools_required_id",
            "spareparts_required_id",
            "total_days",
            "total_hours",
            "total_minutes",
            # "total_time_required",
        ]

    def create(self, validated_data):
        breakdown_data = validated_data.get("breakdown", None)
        schedule_data = validated_data.get("schedule", None)
        if breakdown_data:
            total_days = validated_data.pop("total_days", 0)
            total_hours = validated_data.pop("total_hours", 0)
            total_minutes = validated_data.pop("total_minutes", 0)
            if total_days == 0 and total_hours == 0 and total_minutes == 0:
                raise serializers.ValidationError(
                    {"error": "The total time required cannot be null."}
                )
            validated_data["total_time_required"] = datetime.timedelta(
                days=int(total_days) or 0,
                hours=int(total_hours) or 0,
                minutes=int(total_minutes) or 0,
            )
            validated_data["machine"] = breakdown_data.machine
            validated_data["equipment"] = breakdown_data.equipment or None
            tools_required = validated_data.pop("tools_required", [])
            spareparts_required = validated_data.pop("spareparts_required", [])
            clearances = Clearance.objects.exclude(scheduled=True).filter(active=True)
            if clearances.exists():
                work_order = WorkOrder.objects.create(**validated_data)
                for c in clearances.all():
                    WorkOrderClearance.objects.create(
                        work_order=work_order,
                        description=c.description,
                    )
                work_order.tools_required.set(tools_required)
                work_order.spareparts_required.set(spareparts_required)
                work_order.save()
            else:
                raise serializers.ValidationError(
                    {"error": "You must create at least one clearance for breakdown."}
                )
            breakdown_data.status = "WORK-ORDER CREATED"
            breakdown_data.save()
            return work_order
        elif schedule_data:
            start_date = validated_data.get("start_date")
            scheduled_work_orders = WorkOrder.objects.filter(schedule=schedule_data)

            if scheduled_work_orders.exclude(status="Completed").exists():
                raise serializers.ValidationError(
                    "There's an active work order for this schedule."
                )

            if scheduled_work_orders.filter(start_date=start_date).exists():
                raise serializers.ValidationError(
                    "Duplicate work order on this date for this schedule."
                )
            validated_data["machine"] = schedule_data.machine
            validated_data["equipment"] = schedule_data.equipment or None
            validated_data["work_order_type"] = schedule_data.work_order_type
            validated_data["activity_type"] = schedule_data.activity_type
            validated_data["total_time_required"] = schedule_data.planned_time
            tools_required = schedule_data.tools_required.all() or []
            spareparts_required = schedule_data.spareparts_required.all() or []
            activities = Activity.objects.filter(schedule=schedule_data, active=True)
            clearances = Clearance.objects.exclude(breakdown=True).filter(active=True)
            if activities.exists() and clearances.exists():
                work_order = WorkOrder.objects.create(**validated_data)
                for a in activities.all():
                    WorkOrderActivity.objects.create(
                        work_order=work_order,
                        description=a.description,
                    )
                for c in clearances.all():
                    WorkOrderClearance.objects.create(
                        work_order=work_order,
                        description=c.description,
                    )
                work_order.tools_required.set(tools_required)
                work_order.spareparts_required.set(spareparts_required)
            else:
                if not clearances.exists():
                    raise serializers.ValidationError(
                        "You must create at least one clearance for schedule."
                    )
                if not activities.exists():
                    raise serializers.ValidationError(
                        "The schedule must have at least one active activity."
                    )
            return work_order
        else:
            raise serializers.ValidationError("Unknown error occured.")


class SubmitWorkOrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    remark = serializers.CharField(max_length=250)
    end_date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "remark",
            "end_date",
            "start_time",
            "end_time",
        ]

    def update(self, instance, validated_data):
        try:
            start = datetime.datetime.combine(
                instance.start_date, validated_data.get("start_time")
            )
            end = datetime.datetime.combine(
                validated_data.get("end_date"), validated_data.get("end_time")
            )
            if end < start:
                raise serializers.ValidationError(
                    {"end_date": "The end date and time cannot be less than the start."}
                )

            instance.remark = validated_data.get("remark", instance.remark)
            instance.end_date = validated_data.get("end_date", instance.end_date)
            instance.start_time = validated_data.get("start_time", instance.start_time)
            instance.end_time = validated_data.get("end_time", instance.end_time)
            instance.save()
        except Exception as e:
            raise serializers.ValidationError(
                {
                    "error": "Unknown error while submitting Work Order.",
                }
            )
        return instance


class CompleteWorkOrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    work_order_clearances = WorkOrderClearanceSerializer(many=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "work_order_clearances",
        ]

    def update(self, instance, validated_data):
        clearances_data = validated_data.pop("work_order_clearances", [])
        for clearance_data in clearances_data:
            clearance_id = clearance_data.get("id")
            if clearance_id:
                try:
                    clearance = WorkOrderClearance.objects.get(
                        id=clearance_id, work_order=instance
                    )
                    clearance.value = clearance_data.get("value", clearance.value)
                    clearance.remark = clearance_data.get("remark", clearance.remark)
                    clearance.save()
                except WorkOrderClearance.DoesNotExist:
                    print("work order clearance does not exist.")
                    continue
                except Exception as e:
                    print(e)
                    continue
        return instance


class WorkOrderSerializer(serializers.ModelSerializer):
    from breakdown.serializers import BreakdownSerializer
    from schedule.serializers import ScheduleSerializer

    id = serializers.IntegerField(read_only=True)
    schedule = ScheduleSerializer(read_only=True)
    breakdown = BreakdownSerializer(read_only=True)

    machine = MachineSerializer(read_only=True)
    machine_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Machine.objects.all(),
        source="machine",
    )

    equipment = EquipmentSerializer(read_only=True)
    equipment_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Equipment.objects.all(),
        source="equipment",
    )

    work_order_type = WorkOrderTypeSerializer(read_only=True)
    work_order_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=WorkOrderType.objects.all(),
        source="work_order_type",
    )

    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=ActivityType.objects.all(),
        source="activity_type",
    )

    completed_by = UserSerializer(read_only=True)
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
    work_order_clearances = WorkOrderClearanceSerializer(many=True, read_only=True)

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
            "work_order_clearances",
            "assigned_users",
        ]

    # def get_schedule(self, obj):
    #     try:
    #         schedule_obj = obj.schedule
    #         if schedule_obj == None:
    #             return None
    #         return {
    #             "id": schedule_obj.id,
    #             "type": schedule_obj.type,
    #             "description": schedule_obj.description,
    #         }
    #     except Schedule.DoesNotExist:
    #         return None

    # def get_breakdown(self, obj):
    #     try:
    #         breakdown_obj = obj.breakdown
    #         if breakdown_obj == None:
    #             return None
    #         return {
    #             "id": breakdown_obj.id,
    #             "reason": breakdown_obj.reason,
    #         }
    #     except Breakdown.DoesNotExist:
    #         return None
