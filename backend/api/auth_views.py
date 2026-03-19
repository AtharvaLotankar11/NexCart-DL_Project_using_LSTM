import os
import requests
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import UserProfile
from .serializers import UserSerializer

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
            # Profile is auto-created by signals or we create it here
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.is_email_verified = True
            profile.save()
            
            # Send Verification Email (Nodemailer equivalent)
            subject = 'Welcome to NexCart - Verify Your Email'
            message = f'Hi {user.first_name},\n\nThank you for registering at NexCart. Please verify your email by clicking the link: http://localhost:3000/verify-email?token={user.id}'
            from_email = os.environ.get('EMAIL_HOST_USER')
            recipient_list = [user.email]
            
            send_mail(subject, message, from_email, recipient_list, fail_silently=True)

            return Response({'message': 'Registration successful. Please verify your email.'}, status=status.HTTP_201_CREATED)

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
        user_id = request.data.get('token')
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
            profile.is_email_verified = True
            profile.save()
            return Response({'message': 'Email successfully verified!'})
        except User.DoesNotExist:
            return Response({'error': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)
