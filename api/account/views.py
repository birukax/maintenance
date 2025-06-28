from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Profile
from .serializers import ProfileSerializer, UserSerializer


class ProfileViewset(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    search_fields = ["phone_no", "user__username", "user__email"]
    filterset_fields = ["role", "user__is_active"]

    # def perform_create(self, serializer):
    #     username = self.request.data.get("username")
    #     email = self.request.data.get("email")
    #     try:
    #         user = User(
    #             username=username,
    #             email=email,
    #         )
    #         user.save()
    #     except Exception as e:
    #         raise serializers.ValidationError("error", str(e))

    #     serializer.is_valid(raise_exception=True)
    #     serializer.save(user=user)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    # def perform_update(self, serializer):
    #     is_active = self.request.data.get("is_active")
    #     try:
    #         user = User.objects.get(profile=serializer.instance)
    #         user.is_active = is_active
    #         user.save()
    #     except User.DoesNotExist():
    #         raise serializers.ValidationError("error", "User does not exist!")
    #     except Exception as e:
    #         raise serializers.ValidationError("error", str(e))
    #     return super().perform_update(serializer)

    @action(detail=False, methods=["patch"])
    def change_password(self, request):
        user = self.request.user
        old_password = request.data.get("old_password")
        password = request.data.get("password")
        try:
            if not password:
                raise serializers.ValidationError({"password": "Password is required"})

            if not old_password:
                raise serializers.ValidationError(
                    {"old_password": "Old Password is required"}
                )
            if not user.is_authenticated:
                raise serializers.ValidationError(
                    {"error": "User is not authenticated"}
                )
            if user.password != old_password:
                raise serializers.ValidationError(
                    {"old_password": "Old password is incorrect."}
                )
            validate_password(password, user)
            user.set_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        except Exception as e:
            raise serializers.ValidationError("error", str(e))
        return Response(status=status.HTTP_200_OK)
