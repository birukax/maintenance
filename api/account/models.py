from django.db import models
from django.contrib.auth.models import User as auth_user
from django.urls import reverse
from main.choices import ROLES


class Profile(models.Model):

    user = models.OneToOneField(
        auth_user, on_delete=models.CASCADE, related_name="profile"
    )
    role = models.CharField(choices=ROLES, max_length=20, default="USER")
    # machine = models.ForeignKey(
    #     "machine.Machine", on_delete=models.CASCADE, null=True, blank=True
    # )

    class Meta:
        ordering = ["user__username"]

    def __str__(self):
        return f"{self.user.username}"
