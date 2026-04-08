from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Grievance
from .serializers import RegisterSerializer, GrievanceSerializer
from .permissions import IsAdmin, IsFaculty


# ---------------- JWT TOKENS ----------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# ---------------- REGISTER ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)

        return Response({
            "message": "User registered successfully",
            "tokens": tokens,
            "role": user.role
        }, status=201)

    return Response(serializer.errors, status=400)


# ---------------- LOGIN ----------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user:
        tokens = get_tokens_for_user(user)

        return Response({
            "message": "Login successful",
            "tokens": tokens,
            "role": user.role,
            "full_name": user.full_name,
            "email": user.email,
            "department": user.department
        }, status=200)

    return Response({"error": "Invalid credentials"}, status=401)


# ---------------- CREATE GRIEVANCE ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_grievance(request):

    serializer = GrievanceSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(
            submitted_by=request.user,
            status='NEW'
        )
        return Response({"message": "Grievance submitted"}, status=201)

    return Response(serializer.errors, status=400)


# ---------------- STUDENT / STAFF DASHBOARD ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard(request):

    user = request.user
    grievances = Grievance.objects.filter(submitted_by=user)

    return Response({
        "total": grievances.count(),
        "pending": grievances.filter(status='NEW').count(),
        "in_progress": grievances.filter(status='IN_PROGRESS').count(),
        "resolved": grievances.filter(status='RESOLVED').count(),
        "data": GrievanceSerializer(grievances, many=True).data
    })


# ---------------- FACULTY DASHBOARD ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsFaculty])
def faculty_dashboard(request):

    user = request.user

    filed = Grievance.objects.filter(submitted_by=user)
    assigned = Grievance.objects.filter(assigned_to=user)

    return Response({
        "filed": GrievanceSerializer(filed, many=True).data,
        "assigned": GrievanceSerializer(assigned, many=True).data,
        "assigned_counts": {
            "total": assigned.count(),
            "new": assigned.filter(status='ASSIGNED').count(),
            "in_progress": assigned.filter(status='IN_PROGRESS').count(),
            "resolved": assigned.filter(status='RESOLVED').count(),
        }
    })


# ---------------- ADMIN DASHBOARD ----------------
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard(request):

    grievances = Grievance.objects.all()

    return Response({
        "new": grievances.filter(status='NEW').count(),
        "assigned": grievances.filter(status='ASSIGNED').count(),
        "in_progress": grievances.filter(status='IN_PROGRESS').count(),
        "resolved": grievances.filter(status='RESOLVED').count(),
        "closed": grievances.filter(status='CLOSED').count(),
        "data": GrievanceSerializer(grievances, many=True).data
    })


# ---------------- ASSIGN GRIEVANCE (ADMIN) ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def assign_grievance(request, grievance_id):

    try:
        grievance = Grievance.objects.get(id=grievance_id)
    except Grievance.DoesNotExist:
        return Response({"error": "Grievance not found"}, status=404)

    try:
        faculty = User.objects.get(
            id=request.data.get('faculty_id'),
            role='FACULTY'
        )
    except User.DoesNotExist:
        return Response({"error": "Invalid faculty"}, status=400)

    grievance.assigned_to = faculty
    grievance.status = 'ASSIGNED'
    grievance.save()

    return Response({"message": "Assigned successfully"})


# ---------------- UPDATE STATUS (FACULTY) ----------------
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsFaculty])
def update_status(request, grievance_id):

    try:
        grievance = Grievance.objects.get(id=grievance_id)
    except Grievance.DoesNotExist:
        return Response({"error": "Grievance not found"}, status=404)

    # Only assigned faculty can update
    if grievance.assigned_to != request.user:
        return Response({"error": "Not your task"}, status=403)

    new_status = request.data.get('status')

    if new_status not in ['IN_PROGRESS', 'RESOLVED']:
        return Response({"error": "Invalid status"}, status=400)

    grievance.status = new_status
    grievance.save()

    return Response({"message": "Status updated"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user

    return Response({
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "department": user.department,
        "phone_number": user.phone_number,
        "enrollment_no": user.enrollment_no,
        "date_joined": user.date_joined
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    data = request.data

    user.full_name = data.get('full_name', user.full_name)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.department = data.get('department', user.department)

    # Only for students
    if user.role == 'STUDENT':
        user.enrollment_no = data.get('enrollment_no', user.enrollment_no)

    user.save()

    return Response({
        "message": "Profile updated successfully",
        "full_name": user.full_name,
        "phone_number": user.phone_number,
        "department": user.department
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_grievances(request):
    # Only admin should access
    if request.user.role != "ADMIN":
        return Response({"error": "Unauthorized"}, status=403)

    grievances = Grievance.objects.all().order_by('-created_at')
    serializer = GrievanceSerializer(grievances, many=True)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def assign_grievance(request, id):
    if request.user.role != "ADMIN":
        return Response({"error": "Unauthorized"}, status=403)

    grievance = Grievance.objects.get(id=id)
    grievance.assigned_to = request.data.get("faculty")
    grievance.status = "ASSIGNED"
    grievance.save()

    return Response({"message": "Assigned successfully"})