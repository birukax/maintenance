from django.db import models
from main.models import BaseCreatedUpdated
from main import choices


class ActivityType(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    work_order_type = models.CharField(
        choices=choices.WORK_ORDER_TYPES,
        max_length=30,
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Activity(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(max_length=250)
    activity_type = models.ForeignKey(
        ActivityType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code}"


class WorkOrder(BaseCreatedUpdated):
    machine = models.ForeignKey(
        "asset.Machine",
        on_delete=models.RESTRICT,
        related_name="work_orders",
    )
    equipment = models.ForeignKey(
        "asset.Equipment",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="work_orders",
    )
    materials_required = models.ManyToManyField(
        "inventory.Item",
        blank=True,
        related_name="material_work_orders",
    )

    tools_required = models.ManyToManyField(
        "inventory.Item",
        blank=True,
        related_name="tool_work_orders",
    )
    status = models.CharField(
        choices=choices.WORK_ORDER_STATUS,
        max_length=25,
        default="Created",
    )
    total_time_required = models.DurationField()

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        if self.machine:
            return f"{self.machine.name} - {self.status}"
        return f"{self.status}"


class WorkOrderActivity(BaseCreatedUpdated):
    # description = models.TextField(max_length=250)
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.RESTRICT)
    value = models.BooleanField(choices=choices.YES_NO_NONE, default=None)
    # extra = models.BooleanField(choices=choices.YESNO, default=False)
    remark = models.TextField(max_length=250)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        if self.activity:
            return f"{self.activity} - {self.value}"
        return f"{self.value}"
