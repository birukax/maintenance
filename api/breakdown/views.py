import datetime
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Breakdown
from work_order.models import WorkOrder, WorkOrderType, ActivityType
from inventory.models import Item
from asset.models import Machine, Equipment

from .serializers import BreakdownSerializer


class BreakdownViewSet(viewsets.ModelViewSet):
    queryset = Breakdown.objects.all()
    serializer_class = BreakdownSerializer

    @action(detail=True, methods=["POST"])
    def create_work_order(self, request, pk=None):
        breakdown = self.get_object()
        start_date = request.data.get("start_date")
        spareparts_required_id = request.data.get("spareparts_required_id")
        tools_required_id = request.data.get("tools_required_id")
        work_order_type_id = request.data.get("work_order_type_id")
        activity_type_id = request.data.get("activity_type_id")
        total_time_required = request.data.get("total_time_required")
        total_time_required = datetime.timedelta(minutes=int(total_time_required))
        try:
            if spareparts_required_id:
                spareparts_required = Item.objects.filter(id__in=spareparts_required_id)
            if tools_required_id:
                tools_required = Item.objects.filter(id__in=tools_required_id)
            if work_order_type_id:
                work_order_type = WorkOrderType.objects.get(id=work_order_type_id)
            if activity_type_id:
                activity_type = ActivityType.objects.get(id=activity_type_id)
        except Item.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "spareparts_required_id": f"Item does not exist.",
                    "tools_required_id": f"Item does not exist.",
                }
            )
        except ActivityType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "activity_type_id": f"Activity type with id {activity_type_id} does not exist."
                }
            )
        except WorkOrderType.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "work_order_type_id": f"Work order type with id {work_order_type_id} does not exist."
                }
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        try:
            work_order = WorkOrder(
                breakdown=breakdown,
                start_date=start_date,
                machine=breakdown.machine,
                equipment=breakdown.equipment,
                work_order_type=work_order_type,
                activity_type=activity_type,
                total_time_required=total_time_required,
            )
            work_order.save()
            work_order.tools_required.set(tools_required)
            work_order.spareparts_required.set(spareparts_required)
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})
        breakdown.status = "WORK-ORDER CREATED"
        breakdown.save()
        serializer = BreakdownSerializer(breakdown)
        return Response(serializer.data, status=status.HTTP_200_OK)
