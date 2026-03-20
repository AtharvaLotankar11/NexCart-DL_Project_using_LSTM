import os
import random
import requests
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UserProfile, OTPCode
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ─── USER REGISTRATION & PROFILE ──────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        recaptcha_response = data.get('recaptcha_token')
        
        # Validate reCAPTCHA
        secret_key = os.environ.get('RECAPTCHA_SECRET_KEY')
        if not secret_key:
            return Response({'error': 'Server reCAPTCHA missing config'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        verify_url = 'https://www.google.com/recaptcha/api/siteverify'
        payload = {'secret': secret_key, 'response': recaptcha_response}
        rs = requests.post(verify_url, data=payload)
        rs_data = rs.json()

        if not rs_data.get('success'):
            print(f"DEBUG: reCAPTCHA Validation Failed. Errors: {rs_data.get('error-codes')}")
            return Response({'error': f"Invalid CAPTCHA: {rs_data.get('error-codes')}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        try:
            user = User.objects.create_user(
                username=data.get('email'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name', '')
            )
            
            # Profile is auto-created by signals.py
            profile = user.profile
            profile.is_email_verified = False  
            profile.save()
            
            # Delete any previous OTPs for this email to avoid confusion
            OTPCode.objects.filter(email=user.email).delete()

            # Generate a fresh 6-digit OTP
            code = f"{random.randint(100000, 999999)}"
            OTPCode.objects.create(email=user.email, code=code)

            # Send OTP Verification Email
            subject = 'Welcome to NexCart - Security Verification Code'
            message = (
                f'Hi {user.first_name},\n\n'
                f'Thank you for registering at NexCart. Use the 6-digit verification code below to authorize your business identity:\n\n'
                f'  {code}\n\n'
                f'This code expires in 10 minutes. Do not share it.\n'
                f'Initializing NexCart Access...'
            )
            from_email = os.environ.get('EMAIL_HOST_USER')
            recipient_list = [user.email]
            
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                'message': 'Identity Registered! Security code dispatched to your mail.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        data = request.data
        
        # Update User fields
        user.first_name = data.get('first_name', user.first_name)
        user.save()
        
        # Update Profile fields
        profile = user.profile
        profile.phone_number = data.get('phone_number', profile.phone_number)
        profile.address = data.get('address', profile.address)
        profile.city = data.get('city', profile.city)
        profile.pincode = data.get('pincode', profile.pincode)
        
        # Profile Picture logic
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
            
        profile.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'message': 'Account permanently deactivated from NexCart Grid.'}, status=status.HTTP_204_NO_CONTENT)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()

        if not email or not code:
            return Response({'error': 'Email and security code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check latest OTP for this email
            otp_obj = OTPCode.objects.filter(email=email, code=code).latest('created_at')
            
            if not otp_obj.is_valid():
                otp_obj.delete()
                return Response({'error': 'Security code has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

            # Valid code - verify user
            user = User.objects.get(email=email)
            profile = user.profile
            profile.is_email_verified = True
            profile.save()

            # Clean up used OTP
            otp_obj.delete()

            return Response({'message': 'Identity Successfully Verified! Authorized to access NexCart.'}, status=status.HTTP_200_OK)

        except (OTPCode.DoesNotExist, User.DoesNotExist):
            return Response({'error': 'Invalid verification code or account not found.'}, status=status.HTTP_400_BAD_REQUEST)


# ─── EMAIL OTP & IDENTITY RECOVERY ───────────────────────────────────────────

class SendOTPView(APIView):
    """Generate a 6-digit OTP and email it to the user for login or recovery."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Only allow registered users
        if not User.objects.filter(email=email).exists():
            return Response(
                {'error': 'No account found with this email. Please register first.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Delete any previous OTPs for this email
        OTPCode.objects.filter(email=email).delete()

        # Generate a fresh 6-digit OTP
        code = f"{random.randint(100000, 999999)}"
        OTPCode.objects.create(email=email, code=code)

        # Send email
        from_email = os.environ.get('EMAIL_HOST_USER')
        try:
            send_mail(
                subject='NexCart — Security Verification Code',
                message=(
                    f'Your NexCart verification code is:\n\n'
                    f'  {code}\n\n'
                    f'Use this code to authorize your login, verify your identity, or recover your workspace.\n'
                    f'This code expires in 10 minutes. Do not share it.'
                ),
                from_email=from_email,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response({'error': 'Failed to dispatch security code. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """Verify the OTP and return JWT tokens on success."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()

        if not email or not code:
            return Response({'error': 'Email and OTP code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get latest OTP for this email
            otp_obj = OTPCode.objects.filter(email=email, code=code).latest('created_at')
        except OTPCode.DoesNotExist:
            return Response({'error': 'Invalid OTP. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.is_valid():
            otp_obj.delete()
            return Response({'error': 'OTP has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # OTP is valid — clean it up and issue JWT
        otp_obj.delete()

        try:
            user = User.objects.get(email=email)
            # Auto-verify email if they logged in via OTP
            profile = user.profile
            if not profile.is_email_verified:
                profile.is_email_verified = True
                profile.save()
        except User.DoesNotExist:
            return Response({'error': 'Associated identity not found.'}, status=status.HTTP_404_NOT_FOUND)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """Verify the OTP and reset user password."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        code = request.data.get('code', '').strip()
        new_password = request.data.get('password', '').strip()

        if not email or not code or not new_password:
            return Response({'error': 'Email, OTP code and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({'error': 'Security requirement: Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_obj = OTPCode.objects.filter(email=email, code=code).latest('created_at')
        except OTPCode.DoesNotExist:
            return Response({'error': 'Invalid or missing security code.'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.is_valid():
            otp_obj.delete()
            return Response({'error': 'Security code has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # OTP is valid — reset password
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Clean up OTP after use
            otp_obj.delete()
            
            return Response({'message': 'Neural Link recovered. Please login with your new access key.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User identity not found.'}, status=status.HTTP_404_NOT_FOUND)
