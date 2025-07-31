import datetime
from django.db import models
from main.models import BaseCreatedUpdated
from asset.models import Machine, Equipment
from main import choices


class Breakdown(BaseCreatedUpdated):
    start_date = models.DateField(default=datetime.date.today)
    end_date = models.DateField(null=True, blank=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    equipment = models.ForeignKey(
        Equipment, on_delete=models.CASCADE, blank=True, null=True
    )
    reason = models.TextField(max_length=250)
    remark = models.TextField(max_length=250, null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=choices.BREAKDOWN_STATUS, default="CREATED"
    )
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    total_time = models.DurationField(null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        if self.equipment:
            return f"{self.machine.name} - {self.equipment.name} - {self.start_date}"
        elif self.machine:
            return f"{self.machine.name} - {self.start_date}"
        else:
            return f"{self.start_date}"

    @property
    def has_active_work_order(self):
        from work_order.models import WorkOrder

        try:
            return (
                WorkOrder.objects.filter(breakdown=self)
                .exclude(status="Completed")
                .exists()
            )
        except Exception as e:
            return False
