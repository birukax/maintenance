from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, UserSerializer


class ProfileViewset(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    search_fields = ["phone_no", "user__username", "user__email"]
    filterset_fields = ["role", "user__is_active"]

    def perform_create(self, serializer):
        username = self.request.data.get("username")
        email = self.request.data.get("email")
        password = self.request.data.get("password")
        try:
            user = User(
                username=username,
                email=email,
            )
            user.save()
            user.set_password(password)
            user.save()
        except Exception as e:
            raise serializers.ValidationError("error", str(e))
        
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        is_active = self.request.data.get("is_active")
        try:
            user = User.objects.get(profile=serializer.instance)
            user.is_active = is_active
            user.save()
        except User.DoesNotExist():
            raise serializers.ValidationError("error", "User does not exist!")
        except Exception as e:
            raise serializers.ValidationError("error", str(e))
        return super().perform_update(serializer)
