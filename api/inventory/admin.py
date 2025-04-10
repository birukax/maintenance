from django.contrib import admin
from .models import (
    UnitOfMeasure,
    Contact,
    Item,
    Inventory,
    PurchaseSchedule,
    MonthlyPurchaseSchedule,
    PurchaseRequest,
    Consumption,
    Return,
)

admin.site.register(Item)
admin.site.register(Return)
admin.site.register(Contact)
admin.site.register(Inventory)
admin.site.register(Consumption)
admin.site.register(UnitOfMeasure)
admin.site.register(PurchaseRequest)
admin.site.register(PurchaseSchedule)
admin.site.register(MonthlyPurchaseSchedule)
