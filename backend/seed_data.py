import os
import django
import random
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Category, Product
from django.core.files import File

def seed_products():
    # Correct relative path to prod_images since script runs from backend/
    base_image_dir = Path('../prod_images').resolve()
    media_root = Path('media').resolve()
    
    domains = ["Body Care", "Clothing", "Electronics", "Medicines", "Shoes", "Stationery"]

    # Price ranges for domains (approx in INR)
    price_ranges = {
        "Body Care": (150, 1500),
        "Clothing": (499, 4499),
        "Electronics": (1999, 89999),
        "Medicines": (45, 1800),
        "Shoes": (999, 12999),
        "Stationery": (15, 850)
    }

    print(f"Looking for images in: {base_image_dir}")

    for domain in domains:
        category, created = Category.objects.get_or_create(
            name=domain,
            defaults={'description': f"Premium {domain} collection curated by NexCart AI."}
        )
        print(f"\nProcessing Category: {domain}")

        domain_path = base_image_dir / domain
        if not domain_path.exists():
            print(f"  [!] Skipping: Folder not found at {domain_path}")
            continue

        # Get all image files
        image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']
        images = []
        for ext in image_extensions:
            images.extend(list(domain_path.glob(ext)))

        if not images:
            print(f"  [!] No images found in {domain}")
            continue

        for img_path in images:
            # Generate a cleaner name from filename
            clean_stem = img_path.stem.replace('-', ' ').replace('_', ' ').strip()
            
            # Smart naming logic
            if len(clean_stem) < 3 or clean_stem.isdigit():
                product_name = f"Premium {domain} #{clean_stem}"
            else:
                product_name = clean_stem.title()

            # Avoid duplicates if script runs multiple times
            if Product.objects.filter(name=product_name, category=category).exists():
                print(f"  [-] Skipping {product_name}: Already exists.")
                continue

            price = random.randint(*price_ranges.get(domain, (100, 1000)))
            
            product = Product.objects.create(
                category=category,
                name=product_name,
                description=f"Expertly selected {product_name} from our {domain} department. This product has been chosen by our LSTM-based neural network for its quality and trending popularity.",
                price=price,
                stock_quantity=random.randint(20, 150)
            )

            # Attach the image file
            try:
                with open(img_path, 'rb') as f:
                    product.image.save(img_path.name, File(f), save=True)
                print(f"  [+] Added: {product_name} (₹{price})")
            except Exception as e:
                print(f"  [x] Error adding image for {product_name}: {str(e)}")

if __name__ == "__main__":
    print("--- NexCart Data Seeding Script ---")
    seed_products()
    print("\n--- Seeding Operation Finished ---")
