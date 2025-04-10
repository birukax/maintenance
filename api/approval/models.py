from django.db import models
from django.contrib.auth.models import User
from main.models import BaseCreatedUpdated
from main.choices import APPROVAL_STATUS


class Purchase(BaseCreatedUpdated):
    purchase_request = models.ForeignKey(
        "inventory.PurchaseRequest",
        on_delete=models.RESTRICT,
        related_name="purchase_approvals",
    )
    status = models.CharField(
        choices=APPROVAL_STATUS,
        max_length=20,
        default="PENDING",
    )
    by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="purchase_approvals",
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ["-created_at", "-updated_at"]

    def __str__(self):
        return f"{self.purchase_request.item.name} - {self.status}"
