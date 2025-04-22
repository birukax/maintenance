from django.shortcuts import render
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Breakdown
from .serializers import BreakdownSerializer


class BreakdownViewSet(viewsets.ModelViewSet):
    queryset = Breakdown.objects.all()
    serializer_class = BreakdownSerializer
