from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(
    r"profiles",
    views.ProfileViewset,
    basename="profile",
)

urlpatterns = [
    path("", include(router.urls)),
]
