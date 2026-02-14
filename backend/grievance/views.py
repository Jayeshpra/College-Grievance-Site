from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Grievance
from .serializers import GrievanceSerializer, StudentRegisterSerializer


class GrievanceListCreateView(generics.ListCreateAPIView):
    queryset = Grievance.objects.all()
    serializer_class = GrievanceSerializer
    permission_classes = [IsAuthenticated]

class StudentRegisterView(generics.CreateAPIView):
    serializer_class = StudentRegisterSerializer