import os
import django
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.recommendation_view import get_recommendation_engine
from api.models import Order, OrderItem, Product
from django.contrib.auth.models import User
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

def test_recommendation_for_user(username):
    try:
        user = User.objects.get(username=username)
        print(f"Testing recommendations for user: {user.email}")
        
        factory = APIRequestFactory()
        request = factory.get('/api/user-recommendations/')
        request.user = user
        
        from api.recommendation_view import get_user_recommendations
        response = get_user_recommendations(request)
        print(f"Response Status: {response.status_code}")
        print(f"Number of recommendations: {len(response.data) if isinstance(response.data, list) else 'N/A'}")
        if isinstance(response.data, list):
            for i, p in enumerate(response.data):
                print(f"  {i+1}. {p.get('name')} (Category: {p.get('category', {}).get('name')})")
        else:
            print(f"Response Data: {response.data}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Attempt to test for the user in the screenshot (or any user with orders)
    # The user email from screenshot was '2023.atharva.lotankar@ves.ac.in'
    # Or 'a.lotankar304@gmail.com'
    test_recommendation_for_user('2023.atharva.lotankar@ves.ac.in')
