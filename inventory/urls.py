from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

app_name = "inventory"

urlpatterns = [
    path("unit-of-measure/list/", views.UnitOfMeasureList.as_view()),
    path("unit-of-measure/detail/<int:pk>/", views.UnitOfMeasureDetail.as_view()),
]
urlpatterns = format_suffix_patterns(urlpatterns)
