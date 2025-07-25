import datetime
from django.db import models
from django.contrib.auth.models import User
from main import choices
from main.models import BaseCreatedUpdated


class Contact(BaseCreatedUpdated):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_no = models.CharField(max_length=20)
    address = models.CharField(max_length=100)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}"


class Location(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Shelf(BaseCreatedUpdated):
    location = models.ForeignKey(
        Location, on_delete=models.RESTRICT, related_name="shelves"
    )
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]
        verbose_name_plural = "shelves"

    def __str__(self):
        if self.location:
            return f"{self.location.name} - {self.name}"
        return f"{self.name}"


class ShelfRow(BaseCreatedUpdated):
    shelf = models.ForeignKey(Shelf, on_delete=models.RESTRICT, related_name="rows")
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        if self.shelf:
            return f"{self.shelf.name} - {self.name}"
        return f"{self.name}"


class ShelfBox(BaseCreatedUpdated):
    row = models.ForeignKey(ShelfRow, on_delete=models.RESTRICT, related_name="boxes")
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]
        verbose_name_plural = "shelf boxes"

    def __str__(self):
        if self.row:
            return f"{self.row.name} - {self.name}"
        return f"{self.name}"


class UnitOfMeasure(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Item(BaseCreatedUpdated):
    no = models.CharField(blank=True, max_length=20, unique=True)
    name = models.CharField(max_length=100, unique=True)
    shelf = models.ForeignKey(
        Shelf,
        on_delete=models.RESTRICT,
        related_name="items",
        null=True,
        blank=True,
    )
    row = models.ForeignKey(
        ShelfRow,
        on_delete=models.RESTRICT,
        related_name="items",
        null=True,
        blank=True,
    )
    box = models.ForeignKey(
        ShelfBox,
        on_delete=models.RESTRICT,
        related_name="items",
        null=True,
        blank=True,
    )
    uom = models.ForeignKey(
        UnitOfMeasure, on_delete=models.RESTRICT, related_name="items"
    )
    type = models.CharField(
        choices=choices.ITEM_TYPES, max_length=25, null=True, blank=True
    )
    category = models.CharField(
        choices=choices.ITEM_CATEGORIES, max_length=25, null=True, blank=True
    )

    minimum_stock_level = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    suppliers = models.ManyToManyField(Contact, related_name="items", blank=True)

    def save(self, *args, **kwargs):

        if self.pk is None:
            if self.type:
                prefix = f"{self.type[0:4]}"
            else:
                prefix = f"ITEM"
            last_item = Item.objects.filter(type=self.type).order_by("-id")
            # next_id = last_item.pk + 1 if last_item else 1
            current_id = last_item.first().no[-4:] if last_item.exists() else 0
            next_id = int(current_id) + 1
            digits = len(str(next_id))
            total_expected_zeros = 4 - digits
            zeros = "0" * total_expected_zeros
            print(zeros)
            if total_expected_zeros == 0:
                self.no = f"{prefix}{next_id}"
            self.no = f"{prefix}{zeros}{next_id}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}"


class Inventory(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="inventory",
    )
    location = models.ForeignKey(
        Location,
        on_delete=models.RESTRICT,
        related_name="inventories",
    )
    purchased = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    inbound_transfers = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    outbound_transfers = models.DecimalField(
        default=0, max_digits=10, decimal_places=2, null=True, blank=True
    )
    # consumed_quantity = models.DecimalField(
    #     default=0, max_digits=10, decimal_places=2, null=True, blank=True
    # )
    # returned_quantity = models.DecimalField(
    #     default=0, max_digits=10, decimal_places=2, null=True, blank=True
    # )
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-item__created_at", "location__code"]
        verbose_name_plural = "inventories"

    def __str__(self):
        if self.item and self.location:
            return f"{self.item.name} - {self.location.name}"
        return f"{self.item.name}"


class Transfer(BaseCreatedUpdated):
    requested_by = models.ForeignKey(
        User, on_delete=models.RESTRICT, related_name="transfers_requested"
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="transfers_approved",
        null=True,
        blank=True,
    )
    status = models.CharField(
        choices=choices.TRANSFER_STATUS, max_length=25, default="PENDING-APPROVAL"
    )
    from_location = models.ForeignKey(
        Location, on_delete=models.RESTRICT, related_name="transfers_from"
    )
    to_location = models.ForeignKey(
        Location, on_delete=models.RESTRICT, related_name="transfers_to"
    )
    requested_date = models.DateField(default=datetime.date.today)
    approved_date = models.DateField(null=True, blank=True)
    shipment_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-requested_date", "-created_at"]

    def __str__(self):
        return f"{self.requested_by.username} - {self.requested_date}"


class TransferHistory(BaseCreatedUpdated):
    transfer = models.ForeignKey(
        Transfer, on_delete=models.CASCADE, related_name="transfer_histories"
    )
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="transfer_histories"
    )
    location = models.ForeignKey(
        Location, on_delete=models.RESTRICT, related_name="transfer_histories"
    )
    type = models.CharField(
        choices=choices.TRANSFER_TYPES, max_length=25, null=True, blank=True
    )
    completed = models.BooleanField(default=False)
    date = models.DateField(default=datetime.date.today)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-created_at", "transfer__id", "item__name", "type"]
        verbose_name_plural = "transfer histories"

    def __str__(self):
        if self.item and self.location:
            return f"{self.item.name} - {self.location.name} - {self.type} | {self.quantity}"
        return f"{self.date} - {self.type} - {self.quantity}"


class TransferItem(BaseCreatedUpdated):
    transfer = models.ForeignKey(
        Transfer, on_delete=models.CASCADE, related_name="transfer_items"
    )
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="transfer_items"
    )
    requested_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # shipped_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    # received_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def shipped_quantity(self):
        return (
            TransferHistory.objects.filter(
                transfer=self.transfer, item=self.item, type="OUTBOUND", completed=False
            ).aggregate(total_shipped=models.Sum("quantity"))["total_shipped"]
            or 0
        )

    @property
    def received_quantity(self):
        return (
            TransferHistory.objects.filter(
                transfer=self.transfer, item=self.item, type="INBOUND"
            ).aggregate(total_received=models.Sum("quantity"))["total_received"]
            or 0
        )

    @property
    def total_shipped_quantity(self):
        return (
            TransferHistory.objects.filter(
                transfer=self.transfer, item=self.item, type="OUTBOUND", completed=True
            ).aggregate(total_shipped=models.Sum("quantity"))["total_shipped"]
            or 0
        )

    @property
    def remaining_quantity(self):
        return self.requested_quantity - self.total_shipped_quantity

    class Meta:
        ordering = ["-item__name", "created_at"]

    def __str__(self):
        return f"{self.item.name} - {self.transfer.status}"


class Consumption(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="consumptions"
    )
    date = models.DateField(default=datetime.date.today)
    reason = models.TextField(max_length=250)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    class meta:
        ordering = ["-created_at"]

    def __str__(self):
        if self.item:
            return f"{self.item.name}"


class Return(BaseCreatedUpdated):
    item = models.ForeignKey(Item, on_delete=models.RESTRICT, related_name="returns")
    date = models.DateField(default=datetime.date.today)
    reason = models.TextField(max_length=250)
    used = models.BooleanField(default=True)
    quantity = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    class meta:
        ordering = ["-created_at"]

    def __str__(self):
        if self.item:
            return f"{self.item.name}"
