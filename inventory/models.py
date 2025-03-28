import datetime
from django.db import models
from django.db.models.functions import Lower
from django.contrib.auth.models import User
from main import choices
from main.tasks import BaseCreatedUpdated


class UnitOfMeasure(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]


class Contact(BaseCreatedUpdated):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_no = models.CharField(max_length=20)
    location = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]


class Item(BaseCreatedUpdated):
    name = models.CharField(max_length=100)
    uom = models.ForeignKey(
        UnitOfMeasure, on_delete=models.RESTRICT, related_name="items"
    )
    type = models.CharField(
        choices=choices.ITEM_TYPES, max_length=25, null=True, blank=True
    )
    category = models.CharField(
        choices=choices.ITEM_CATEGORIES, max_length=25, null=True, blank=True
    )
    suppliers = models.ManyToManyField(Contact, related_name="items", blank=True)

    class Meta:
        ordering = ["name"]


class Inventory(BaseCreatedUpdated):
    item = models.ForeignKey(Item, on_delete=models.RESTRICT, related_name="items")
    purchased_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    consumed_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    returned_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-updated_at"]


class PurchaseSchedule(BaseCreatedUpdated):
    item = models.OneToOneField(
        Item, on_delete=models.RESTRICT, related_name="purchase_schedule"
    )
    minimum_stock_level = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    class Meta:
        ordering = ["-updated_at"]


class MonthlyPurchaseSchedule(BaseCreatedUpdated):
    purchase_schedule = models.ForeignKey(
        PurchaseSchedule,
        on_delete=models.RESTRICT,
        related_name="monthly_purchase_schedules",
    )
    month = models.CharField(choices=choices.MONTH_NAMES, max_length=25, default=1)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    class Meta:
        ordering = ["month"]


class PurchaseRequest(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="purchase_requests"
    )
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    received_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    requested_date = models.DateField(default=datetime.datetime.today)
    requested_by = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="purchase_requests"
    )
    approved_by = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="approved_purchase_requests"
    )
    received_date = models.DateField(null=True, blank=True)
    priority = models.CharField(
        choices=choices.PRIORITIES, max_length=25, default="MEDIUM"
    )
    status = models.CharField(
        choices=choices.PURCHASE_STATUS, max_length=50, default="PENDING-APPROVAL"
    )

    class Meta:
        ordering = ["-updated_at"]
