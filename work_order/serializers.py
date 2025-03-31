from rest_framework import serializers
from .models import ActivityType, Activity, WorkOrder, WorkOrderActivity
from inventory.models import Item


class ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = [
            "code",
            "name",
            "work_order_type",
        ]


class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    activity_type = serializers.HyperlinkedIdentityField(
        view_name="activity_types",
        lookup_field="id",
    )

    class Meta:
        model = Activity
        fields = [
            "code",
            "description",
            "activity_type",
        ]


class WorkOrderSerializer(serializers.HyperlinkedModelSerializer):
    machine = serializers.HyperlinkedIdentityField(
        view_name="machines",
        lookup_field="id",
    )
    equipment = serializers.HyperlinkedIdentityField(
        view_name="equipments",
        lookup_field="id",
    )
    materials_required = serializers.HyperlinkedRelatedField(
        view_name="items",
        queryset=Item.objects.filter(category="SPAREPART"),
        lookup_field="id",
        many=True,
    )
    tools_required = serializers.HyperlinkedRelatedField(
        view_name="items",
        queryset=Item.objects.filter(category="TOOL"),
        lookup_field="id",
        many=True,
    )

    class Meta:
        model = WorkOrder
        fields = [
            "machine",
            "equipment",
            "materials_required",
            "tools_required",
            "total_time_required",
        ]


class WorkOrderActivitySerializer(serializers.HyperlinkedModelSerializer):

    work_order = serializers.HyperlinkedIdentityField(
        view_name="work_orders",
        lookup_field="id",
    )
    activity = serializers.HyperlinkedIdentityField(
        view_name="activities",
        lookup_field="id",
    )

    class Meta:
        model = WorkOrderActivity
        fields = [
            "work_order",
            "activity",
            "value",
            "remark",
        ]
