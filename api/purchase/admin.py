from django.contrib import admin
from .models import (
    Schedule,
    Request,
)


admin.site.register(Request)
admin.site.register(Schedule)
