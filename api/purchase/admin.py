from django.contrib import admin
from .models import (
    Schedule,
    MonthlySchedule,
    Request,
)


admin.site.register(Request)
admin.site.register(Schedule)
admin.site.register(MonthlySchedule)
