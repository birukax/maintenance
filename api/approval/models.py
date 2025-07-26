from django.db import models
from django.contrib.auth.models import User
from main.models import BaseCreatedUpdated
from main.choices import APPROVAL_STATUS


class BaseApproval(BaseCreatedUpdated):
    status = models.CharField(
        choices=APPROVAL_STATUS,
        max_length=20,
        default="PENDING",
    )
    remark = models.TextField(
        max_length=250,
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True


class Purchase(BaseApproval):
    purchase_request = models.ForeignKey(
        "purchase.Request",
        on_delete=models.CASCADE,
        related_name="purchase_approvals",
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
        return f"{self.purchase_request.id} - {self.status}"


class Transfer(BaseApproval):
    transfer = models.ForeignKey(
        "inventory.Transfer",
        on_delete=models.CASCADE,
        related_name="transfer_approvals",
    )
    by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        related_name="transfer_approvals",
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ["-created_at", "-updated_at"]

    def __str__(self):
        return f"{self.transfer.id} - {self.status}"
