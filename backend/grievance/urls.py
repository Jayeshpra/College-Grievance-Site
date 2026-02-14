from django.urls import path
from .views import GrievanceListCreateView, StudentRegisterView

urlpatterns = [
    path('grievances/', GrievanceListCreateView.as_view(), name='grievance-list-create'),
    path('register/student/', StudentRegisterView.as_view(), name='student-register'),
]
