from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import string

class User(AbstractUser):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('STAFF', 'Staff'),
        ('FACULTY', 'Faculty'),
        ('ADMIN', 'Admin'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    enrollment_no = models.CharField(max_length=50, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.full_name} ({self.role})"


def generate_grievance_id():
    digits = ''.join(random.choices(string.digits, k=6))
    return f"GR-{digits}"


class Grievance(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('ASSIGNED', 'Assigned'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    )

    grievance_id = models.CharField(
        max_length=10,
        unique=True,
        default=generate_grievance_id,
        editable=False
    )

    subject = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    description = models.TextField()
    date_filed = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='grievances/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')

    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_grievances')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')

    def __str__(self):
        return f"{self.grievance_id} - {self.subject}"