import datetime
from django.db import models
from django.db.models.functions import Lower
from django.contrib.auth.models import User
from main import choices
from main.models import BaseCreatedUpdated


class UnitOfMeasure(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Contact(BaseCreatedUpdated):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_no = models.CharField(max_length=20)
    address = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}"


class Item(BaseCreatedUpdated):
    no = models.CharField(blank=True, max_length=20, unique=True)
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

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.type:
                prefix = f"{self.type[0:4]}"
            else:
                prefix = f"ITEM"
            last_item = Item.objects.order_by("-pk").first()
            # next_id = last_item.pk + 1 if last_item else 1
            next_id = last_item.no.split("-")[-1] if last_item else 1
            next_id = int(next_id) + 1
            self.no = f"{prefix}-{next_id}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}"


class Inventory(BaseCreatedUpdated):
    item = models.OneToOneField(
        Item, on_delete=models.RESTRICT, related_name="inventory"
    )
    purchased_quantity = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    consumed_quantity = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    returned_quantity = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name_plural = "inventories"

    def __str__(self):
        return f"{self.item.name}"


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

    def __str__(self):
        if self.item:
            return f"{self.item.name}"


class MonthlyPurchaseSchedule(BaseCreatedUpdated):
    purchase_schedule = models.ForeignKey(
        PurchaseSchedule,
        on_delete=models.RESTRICT,
        related_name="monthly_purchase_schedules",
    )
    month = models.IntegerField(choices=choices.MONTH_NAMES, default=1)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    class Meta:
        ordering = ["month"]

    def __str__(self):
        if self.purchase_schedule:
            return f"{self.purchase_schedule.item.name} - {self.month}"
        return f"{self.month}"


class PurchaseRequest(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="purchase_requests"
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    received_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    requested_date = models.DateField(default=datetime.date.today)
    requested_by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="purchase_requests",
        null=True,
        blank=True,
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="approved_purchase_requests",
        null=True,
        blank=True,
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

    def __str__(self):
        if self.item and self.requested_by:
            return f"{self.item.name} - {self.requested_by}"
        elif self.item:
            return f"{self.item.name}"


class Consumption(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="consumptions"
    )
    date = models.DateField(default=datetime.datetime.now)
    reason = models.TextField(max_length=250)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    def __str__(self):
        if self.item:
            return f"{self.item.name}"


class Return(BaseCreatedUpdated):
    item = models.ForeignKey(Item, on_delete=models.RESTRICT, related_name="returns")
    date = models.DateField(default=datetime.datetime.now)
    reason = models.TextField(max_length=250)
    used = models.BooleanField(default=True)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    def __str__(self):
        if self.item:
            return f"{self.item.name}"
