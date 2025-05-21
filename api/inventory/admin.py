from django.contrib import admin
from .models import (
    Contact,
    Location,
    Shelf,
    ShelfRow,
    ShelfBox,
    UnitOfMeasure,
    Item,
    Inventory,
    Transfer,
    TransferItem,
    TransferHistory,
    Consumption,
    Return,
    Location,
)

admin.site.register(Contact)
admin.site.register(Location)
admin.site.register(Shelf)
admin.site.register(ShelfRow)
admin.site.register(ShelfBox)
admin.site.register(UnitOfMeasure)
admin.site.register(Item)
admin.site.register(Inventory)
admin.site.register(Transfer)
admin.site.register(TransferItem)
admin.site.register(TransferHistory)
admin.site.register(Consumption)
admin.site.register(Return)
