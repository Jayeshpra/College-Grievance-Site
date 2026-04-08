from django.urls import path
from .views import *

urlpatterns = [

    # AUTH
    path('register/', register_user),
    path('login/', login_user),
    path('profile/', get_profile),
    path('profile/update/', update_profile),

    # DASHBOARDS
    path('student/dashboard/', student_dashboard),
    path('faculty/dashboard/', faculty_dashboard),
    path('admin/dashboard/', admin_dashboard),

    # GRIEVANCE
    path('grievance/create/', create_grievance),
    path('grievance/assign/<int:grievance_id>/', assign_grievance),
    path('grievance/update/<int:grievance_id>/', update_status),
    path('admin/grievances/', get_all_grievances),
]