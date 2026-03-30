from rest_framework import serializers
from .models import User, Grievance


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'role',
            'full_name',
            'email',
            'phone_number',
            'department',
            'enrollment_no',
            'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        role = data.get('role')

        # If STUDENT → enrollment_no required
        if role == 'STUDENT' and not data.get('enrollment_no'):
            raise serializers.ValidationError({
                "enrollment_no": "Enrollment number is required for students"
            })

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.username = validated_data['email']

        user.save()
        return user


class GrievanceSerializer(serializers.ModelSerializer):
    submitted_by_name = serializers.CharField(source='submitted_by.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)

    class Meta:
        model = Grievance
        fields = '__all__'
        extra_kwargs = {
            'submitted_by': {'required': False},
            'assigned_to': {'required': False}
        }