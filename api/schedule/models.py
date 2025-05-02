import datetime
from django.db import models
from main.choices import SCHEDULE_TYPES
from django.contrib.auth.models import User
from main.models import BaseCreatedUpdated
from inventory.models import Item
from asset.models import Machine, Equipment


class Schedule(BaseCreatedUpdated):
    type = models.CharField(choices=SCHEDULE_TYPES, max_length=25)
    description = models.TextField(max_length=250)
    machine = models.ForeignKey(
        Machine,
        on_delete=models.RESTRICT,
        related_name="schedules",
    )
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.RESTRICT,
        related_name="schedules",
        null=True,
        blank=True,
    )
    work_order_type = models.ForeignKey(
        "work_order.WorkOrderType",
        on_delete=models.RESTRICT,
        related_name="schedules",
    )
    activity_type = models.ForeignKey(
        "work_order.ActivityType",
        on_delete=models.RESTRICT,
        related_name="schedules",
    )
    tools_required = models.ManyToManyField(
        Item,
        blank=True,
        related_name="tool_schedules",
    )
    spareparts_required = models.ManyToManyField(
        Item,
        blank=True,
        related_name="sparepart_schedules",
    )
    planned_time = models.DurationField(null=True, blank=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        if self.machine:
            return f"{self.machine.name} - {self.type}"
        return f"{self.type}"
