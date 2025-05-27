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
    name = models.CharField(max_length=100)
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
            last_item = Item.objects.filter(type=self.type).order_by("-id").first()
            # next_id = last_item.pk + 1 if last_item else 1
            next_id = last_item.no.split("-")[-1] if last_item else 1
            next_id = int(next_id) + 1
            self.no = f"{prefix}-{next_id}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at", "name"]

    def __str__(self):
        return f"{self.name}"


class Inventory(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item,
        on_delete=models.RESTRICT,
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
        ordering = ["-updated_at"]
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
        User, on_delete=models.RESTRICT, related_name="transfers_approved", null=True, blank=True,
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
    requested_date = models.DateField(default=datetime.datetime.now)
    approved_date = models.DateField(null=True, blank=True)
    shipment_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-requested_date", "-created_at"]

    def __str__(self):
        return f"{self.requested_by.username} - {self.requested_date}"


class TransferItem(BaseCreatedUpdated):
    transfer = models.ForeignKey(
        Transfer, on_delete=models.CASCADE, related_name="transfer_items"
    )
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="transfer_items"
    )
    requested_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transfered_quantity = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )

    class Meta:
        ordering = ["-item__name", "created_at"]

    def __str__(self):
        return f"{self.item.name} - {self.transfer.status}"


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
    date = models.DateField(default=datetime.datetime.now)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ["-created_at", "transfer__id", "item__name", "type"]

    def __str__(self):
        if self.item and self.location:
            return f"{self.item.name} - {self.location.name}"
        return f"{self.date} - {self.quantity}"


class Consumption(BaseCreatedUpdated):
    item = models.ForeignKey(
        Item, on_delete=models.RESTRICT, related_name="consumptions"
    )
    date = models.DateField(default=datetime.datetime.now)
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
    date = models.DateField(default=datetime.datetime.now)
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
