from django.contrib import admin
from .models import (
    Activity,
    ActivityType,
    WorkOrder,
    WorkOrderType,
    WorkOrderActivity,
    Clearance,
    WorkOrderClearance,
)

admin.site.register(Activity)
admin.site.register(ActivityType)
admin.site.register(WorkOrder)
admin.site.register(WorkOrderType)
admin.site.register(WorkOrderActivity)
admin.site.register(Clearance)
admin.site.register(WorkOrderClearance)
