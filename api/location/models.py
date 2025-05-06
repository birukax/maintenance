from django.db import models
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
        on_delete=models.RESTRICT,
        related_name="areas",
    )
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]
        unique_together = ["code", "plant"]

    def __str__(self):
        return f"{self.name}"
