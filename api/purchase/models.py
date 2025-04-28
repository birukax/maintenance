import datetime
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from main import choices
from main.models import BaseCreatedUpdated
from django.contrib.auth.models import User
from inventory.models import Item


class Schedule(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="purchase_schedule"
    )
    year = models.IntegerField(
        validators=[
            MinValueValidator(2025),
            MaxValueValidator(datetime.date.today().year + 1),
        ],
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["year", "item__name"]
        unique_together = ["item", "year"]

    def __str__(self):
        if self.item:
            return f"{self.item.name}"


class MonthlySchedule(BaseCreatedUpdated):
    schedule = models.OneToOneField(
        Schedule,
        on_delete=models.CASCADE,
        related_name="monthly_schedule",
    )
    january = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    february = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    march = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    april = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    may = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    june = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    july = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    august = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    september = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    october = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    november = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    december = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["schedule__year"]

    def __str__(self):
        if self.schedule:
            return f"{self.schedule.item.name}"


class Request(BaseCreatedUpdated):
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
