import os
import django
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product

try:
    count = Product.objects.count()
    print(f"COUNT:{count}")
    for p in Product.objects.all()[:5]:
        print(f"PROD:{p.name}")
except Exception as e:
    print(f"ERROR:{str(e)}")
