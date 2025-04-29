from django.contrib import admin
from .models import (
    Schedule,
    Request,
    Year,
)


admin.site.register(Request)
admin.site.register(Schedule)
admin.site.register(Year)
