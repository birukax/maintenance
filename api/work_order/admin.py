from django.contrib import admin
from .models import Activity, ActivityType, WorkOrder, WorkOrderType, WorkOrderActivity

admin.site.register(Activity)
admin.site.register(ActivityType)
admin.site.register(WorkOrder)
admin.site.register(WorkOrderType)
admin.site.register(WorkOrderActivity)
