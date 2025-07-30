from django.contrib import admin
from .models import Schedule, Request, Year, PurchaseHistory, RequestItem


admin.site.register(Request)
admin.site.register(Schedule)
admin.site.register(Year)
admin.site.register(PurchaseHistory)
admin.site.register(RequestItem)
