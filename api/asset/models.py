from django.db import models
from django.contrib.auth.models import User
from main import choices
from main.tasks import BaseCreatedUpdated


class Location(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]


class Machine(BaseCreatedUpdated):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    location = models.ForeignKey(
        Location,
        on_delete=models.RESTRICT,
        related_name="machines",
    )

    class Meta:
        ordering = ["code"]


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
