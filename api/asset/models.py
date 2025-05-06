from django.db import models
from django.contrib.auth.models import User
from main import choices
from location.models import Area, Plant
from main.models import BaseCreatedUpdated


class Machine(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    area = models.ForeignKey(
        Area,
        on_delete=models.RESTRICT,
        related_name="machines",
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        if self.area:
            return f"{self.name} - {self.area.name}"
        return f"{self.name}"


class Equipment(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    machine = models.ForeignKey(
        Machine,
        on_delete=models.RESTRICT,
        related_name="equipments",
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        if self.machine:
            return f"{self.name} - {self.machine.name}"
        return f"{self.name}"
