from rest_framework import serializers
from .models import Grievance
from django.contrib.auth import get_user_model


class GrievanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = '__all__'


User = get_user_model()

class StudentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'enrollment_number', 'department']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            enrollment_number=validated_data.get('enrollment_number'),
            department=validated_data.get('department'),
            role='student'   # 🔥 automatically set role
        )
        return user
