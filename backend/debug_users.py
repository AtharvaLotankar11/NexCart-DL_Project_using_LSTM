import os
import django
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

try:
    print(f"USER_COUNT:{User.objects.count()}")
    for user in User.objects.all():
        try:
            profile = user.profile
            print(f"USER:{user.email} | VERIFIED:{profile.is_email_verified} | PHONE:{profile.phone_number}")
        except UserProfile.DoesNotExist:
            print(f"USER:{user.email} | NO PROFILE")
except Exception as e:
    print(f"ERROR:{str(e)}")
