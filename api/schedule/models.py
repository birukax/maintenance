from datetime import date, timedelta
from django.db import models
from main.choices import SCHEDULE_TYPES
from main.models import BaseCreatedUpdated
from inventory.models import Item
from asset.models import Machine, Equipment
from work_order.models import WorkOrder


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

    @property
    def total_work_orders(self):
        try:
            return WorkOrder.objects.filter(schedule=self).count()
        except:
            return 0

    @property
    def is_complete(self):
        today = date.today()
        qs = WorkOrder.objects.filter(schedule=self)
        if self.type == "DAILY":
            return qs.filter(start_date=today).exists()
        elif self.type == "WEEKLY":
            start_of_week = today - timedelta(days=today.weekday())
            end_of_week = start_of_week + timedelta(days=6)
            return qs.filter(
                start_date__gte=start_of_week, start_date__lte=end_of_week
            ).exists()
        elif self.type == "MONTHLY":
            return qs.filter(
                start_date__year=today.year, start_date__month=today.month
            ).exists()
        elif self.type == "YEARLY":
            return qs.filter(start_date__year=today.year).exists()
