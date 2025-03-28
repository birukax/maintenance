from django.contrib import admin
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
)

admin.site.register(UnitOfMeasure)
admin.site.register(Contact)
admin.site.register(Item)
admin.site.register(Inventory)
admin.site.register(PurchaseSchedule)
admin.site.register(MonthlyPurchaseSchedule)
admin.site.register(PurchaseRequest)
