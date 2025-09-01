import datetime
from django.db import models
from django.db.models import Sum
from django.core.validators import MinValueValidator, MaxValueValidator
from main import choices
from main.models import BaseCreatedUpdated
from django.contrib.auth.models import User


class Year(BaseCreatedUpdated):
    no = models.IntegerField(
        validators=[
            MinValueValidator(2025),
            MaxValueValidator(datetime.date.today().year + 1),
        ],
    )

    class Meta:
        ordering = ["-no"]

    def __str__(self):
        return str(self.no)


class Request(BaseCreatedUpdated):
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
    location = models.ForeignKey(
        "inventory.Location",
        on_delete=models.RESTRICT,
        related_name="purchase_requests",
    )
    requested_date = models.DateField(default=datetime.date.today())
    approved_date = models.DateField(null=True, blank=True)
    priority = models.CharField(
        choices=choices.PRIORITIES, max_length=25, default="MEDIUM"
    )
    status = models.CharField(
        choices=choices.PURCHASE_STATUS, max_length=50, default="PENDING-APPROVAL"
    )

    class Meta:
        ordering = ["-created_at", "-updated_at"]

    def __str__(self):
        if self.location and self.requested_by:
            return f"{self.id} - {self.location.name} - {self.requested_by}"
        elif self.location:
            return f"{self.id} - {self.location.name}"


class PurchaseHistory(BaseCreatedUpdated):
    request = models.ForeignKey(
        Request,
        on_delete=models.CASCADE,
        related_name="purchase_histories",
    )
    item = models.ForeignKey(
        "inventory.Item", on_delete=models.RESTRICT, related_name="purchase_histories"
    )
    location = models.ForeignKey(
        "inventory.Location",
        on_delete=models.RESTRICT,
        related_name="purchase_histories",
    )
    date = models.DateField(default=datetime.date.today)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-created_at", "request__id", "item__name"]
        verbose_name_plural = "purchase histories"

    def __str__(self):
        if self.item and self.location:
            return f"{self.item.name} - {self.location.name} | {self.quantity}"
        return f"{self.date} - {self.quantity}"


class RequestItem(BaseCreatedUpdated):
    request = models.ForeignKey(
        Request,
        on_delete=models.CASCADE,
        related_name="request_items",
    )
    item = models.ForeignKey(
        "inventory.Item", on_delete=models.RESTRICT, related_name="request_items"
    )
    requested_quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    @property
    def received_quantity(self):
        try:
            return (
                PurchaseHistory.objects.filter(
                    request=self.request, item=self.item
                ).aggregate(total_received=models.Sum("quantity"))["total_received"]
                or 0
            )
        except Exception as e:
            print(e)
            return 0

    @property
    def remaining_quantity(self):
        try:
            return self.requested_quantity - self.received_quantity
        except Exception as e:
            return 0


class Schedule(BaseCreatedUpdated):
    item = models.ForeignKey(
        "inventory.Item", on_delete=models.RESTRICT, related_name="purchase_schedules"
    )
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name="schedules")
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

    @property
    def quantity(self):
        return (
            self.january
            + self.february
            + self.march
            + self.april
            + self.may
            + self.june
            + self.july
            + self.august
            + self.september
            + self.october
            + self.november
            + self.december
        )

    @property
    def purchased_quantity(self):
        purchases = PurchaseHistory.objects.filter(
            item=self.item,
            date__range=[
                datetime.date(self.year.no, 1, 1),
                datetime.date(self.year.no, 12, 31),
            ],
        )
        return (purchases.aggregate(Sum("quantity"))["quantity__sum"] or 0) or 0

    @property
    def balance(self):
        from inventory.models import Inventory

        item_inventories = Inventory.objects.filter(item=self.item)
        try:
            if item_inventories.exists():
                return sum(inv.balance for inv in item_inventories)
            else:
                return 0
        except Exception as e:
            return 0

    class Meta:
        ordering = ["-year__no", "item__name"]
        unique_together = ["item", "year"]

    def __str__(self):
        if self.item:
            return f"{self.item.name}"
