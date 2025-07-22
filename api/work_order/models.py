import datetime
from django.db import models
from django.contrib.auth.models import User
from main.models import BaseCreatedUpdated

# from schedule.models import Schedule
from breakdown.models import Breakdown
from main import choices


class WorkOrderType(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    scheduled = models.BooleanField(default=False)
    breakdown = models.BooleanField(default=False)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class ActivityType(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    work_order_type = models.ForeignKey(
        WorkOrderType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="activity_types",
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Activity(BaseCreatedUpdated):
    description = models.TextField(max_length=250)
    active = models.BooleanField(default=True)
    schedule = models.ForeignKey(
        "schedule.Schedule",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="activities",
    )
    # activity_type = models.ForeignKey(
    #     ActivityType,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    #     related_name="activities",
    # )

    class Meta:
        ordering = ["description"]
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.description}"


class WorkOrder(BaseCreatedUpdated):
    breakdown = models.ForeignKey(
        Breakdown,
        on_delete=models.RESTRICT,
        related_name="work_orders",
        null=True,
        blank=True,
    )
    schedule = models.ForeignKey(
        "schedule.Schedule",
        on_delete=models.RESTRICT,
        related_name="work_orders",
        null=True,
        blank=True,
    )
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
    spareparts_required = models.ManyToManyField(
        "inventory.Item",
        blank=True,
        related_name="sparepart_work_orders",
    )
    tools_required = models.ManyToManyField(
        "inventory.Item",
        blank=True,
        related_name="tool_work_orders",
    )
    work_order_type = models.ForeignKey(
        WorkOrderType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="work_orders",
    )
    activity_type = models.ForeignKey(
        ActivityType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="work_orders",
    )
    assigned_users = models.ManyToManyField(
        User,
        blank=True,
        related_name="assigned_work_orders",
    )
    completed_by = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
        related_name="completed_work_orders",
    )
    status = models.CharField(
        choices=choices.WORK_ORDER_STATUS,
        max_length=25,
        default="Created",
    )
    remark = models.TextField(max_length=250, null=True, blank=True)
    start_date = models.DateField(default=datetime.date.today)
    start_time = models.TimeField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    total_time_required = models.DurationField(null=True, blank=True)

    @property
    def total_time_taken(self):
        try:
            start = datetime.datetime.combine(self.start_date, self.start_time)
            end = datetime.datetime.combine(self.end_date, self.end_time)
            total = end - start
            return f"{total}"
        except Exception as e:
            print(e)
        return None

    def __str__(self):
        if self.machine:
            return f"{self.machine.name} - {self.status}"
        return f"{self.status}"

    class Meta:
        ordering = ["-created_at"]


class WorkOrderActivity(BaseCreatedUpdated):
    # description = models.TextField(max_length=250)
    work_order = models.ForeignKey(
        WorkOrder,
        on_delete=models.CASCADE,
        related_name="work_order_activities",
    )
    description = models.TextField(max_length=300)
    value = models.BooleanField(choices=choices.YES_NO_NONE, default=False)
    # extra = models.BooleanField(choices=choices.YESNO, default=False)
    remark = models.TextField(max_length=250, null=True, blank=True)

    class Meta:
        ordering = ["created_at", "updated_at", "description"]
        verbose_name_plural = "Work Order Activities"

    def __str__(self):
        if self.description:
            return f"{self.description} - {self.value}"
        return f"{self.value}"
