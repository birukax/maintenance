from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"schedules",
    views.ScheduleVeiwSet,
    basename="schedule",
)

urlpatterns = [
    path("", include(router.urls)),
]
