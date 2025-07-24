from django.db import models
from django.contrib.auth.models import User
from main import choices
from main.models import BaseCreatedUpdated


class Plant(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}"


class Area(BaseCreatedUpdated):
    plant = models.ForeignKey(
        Plant,
        on_delete=models.SET_NULL,
        related_name="areas",
        null=True,
    )
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]
        unique_together = ["code", "plant"]

    def __str__(self):
        return f"{self.name}"


class Machine(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    area = models.ForeignKey(
        Area,
        on_delete=models.SET_NULL,
        related_name="machines",
        null=True,
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
        on_delete=models.SET_NULL,
        related_name="equipments",
        null=True,
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        if self.machine:
            return f"{self.name} - {self.machine.name}"
        return f"{self.name}"
