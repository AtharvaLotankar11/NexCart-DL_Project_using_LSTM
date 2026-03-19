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
    
    domains = ["Body Care", "Clothing", "Electronics", "Medicines", "Shoes", "Stationery"]

    # Detailed Mapping for 90 Products
    product_mapping = {
        "Electronics": {
            "mobile1": "Samsung Galaxy A16",
            "mobile2": "iPhone 15 Pro Max",
            "mobile3": "Google Pixel 8 Pro",
            "mobile4": "OnePlus 12 5G",
            "mobile5": "Asus ROG Phone 7",
            "laptop1": "MacBook Pro M3 Max",
            "laptop2": "Dell XPS 15 OLED",
            "laptop3": "HP Spectre x360",
            "laptop4": "Lenovo Legion Slim 7",
            "laptop5": "Acer Swift Go 14",
            "tv1": "Samsung Crystal 4K UHD",
            "tv2": "Sony BRAVIA XR OLED",
            "tv3": "LG QNED MiniLED",
            "fridge1": "Whirlpool 3-Door French",
            "fridge2": "Bosch Series 6 Smart"
        },
        "Shoes": {
            "shoes1": "Nike Air Max 270",
            "shoes2": "Adidas Ultraboost 22",
            "shoes3": "Puma RS-X Reinvent",
            "shoes4": "Reebok Nano X3",
            "shoes5": "New Balance 574 Classic",
            "shoes6": "Converse Chuck 70",
            "shoes7": "Vans Old Skool Core",
            "shoes8": "Asics Gel-Kayano 29",
            "shoes9": "Under Armour Hovr",
            "shoes10": "Skechers D'Lites Life",
            "shoes11": "Timberland 6-Inch Premium",
            "shoes12": "Dr. Martens 1460 Smooth",
            "shoes13": "Clarks Originals Desert",
            "shoes14": "Crocs Classic Clog",
            "shoes15": "Birkenstock Arizona SFB"
        },
        "Body Care": {
            "care1": "Nivea Soft Refreshing Cream",
            "care2": "Dove Deep Moisture Body Wash",
            "care3": "Vaseline Intensive Care Lotion",
            "care4": "Neutrogena Hydro Boost Water",
            "care5": "Olay Regenerist Micro-Sculpt",
            "care6": "Cetaphil Gentle Skin Cleanser",
            "care7": "Aveeno Daily Moisturizing",
            "care8": "L'Oreal Revitalift Night",
            "care9": "Clinique Moisture Surge 100H",
            "care10": "Estee Lauder Advanced Night",
            "care11": "Kiehl's Ultra Facial Cream",
            "care12": "The Ordinary Hyaluronic 2%",
            "care13": "La Roche-Posay Anthelios",
            "care14": "CeraVe Moisturizing Cream",
            "care15": "Bioderma Micellar Water"
        },
        "Medicines": {
            "med1": "Vicks VapoShower Plus",
            "med2": "Tylenol Extra Strength 500mg",
            "med3": "Advil Liqui-Gels 200mg",
            "med4": "Claritin 24-Hour Allergy",
            "med5": "Zyrtec Allergy Relief",
            "med6": "Benadryl Allergy Ultratabs",
            "med7": "Pepto-Bismol Liquid",
            "med8": "Nexium 24HR Acid Block",
            "med9": "Prilosec OTC Heartburn",
            "med10": "Mucinex Fast-Max Cold",
            "med11": "DayQuil & NyQuil Combo",
            "med12": "Airborne Immune Support",
            "med13": "Emergen-C 1000mg Vitamin C",
            "med14": "Bayer Aspirin Regimen",
            "med15": "Excedrin Migraine Relief"
        },
        "Stationery": {
            "sta1": "Faber-Castell Color 24 Pack",
            "sta2": "Staedtler Fineliners Set",
            "sta3": "Parker Frontier Pen Matte",
            "sta4": "Moleskine Classic Notebook",
            "sta5": "Post-it Super Sticky Notes",
            "sta6": "Pilot G2 Gel Pens 0.7mm",
            "sta7": "Sharpie Permanent Markers",
            "sta8": "Uni-ball Signo DX 0.38",
            "sta9": "Tombow Dual Brush 10 Set",
            "sta10": "Lamy Safari Fountain Pen",
            "sta11": "Rhodia DotPad No. 16",
            "sta12": "Leuchtturm1917 Hardcover",
            "sta13": "Pentel GraphGear 1000",
            "sta14": "Zebra Sarasa Clip 0.5",
            "sta15": "Kokuyo Campus B5 Notebook"
        },
        "Clothing": {
            "shirt1": "Polo Ralph Lauren Oxford",
            "shirt2": "Tommy Hilfiger Classic Fit",
            "shirt3": "Levi's Western Denim Shirt",
            "shirt4": "Uniqlo Linen Blend Shirt",
            "shirt5": "Zara Slim Fit Poplin",
            "shirt6": "H&M Premium Cotton Shirt",
            "shirt7": "Brooks Brothers Non-Iron",
            "shirt8": "Calvin Klein Dress Shirt",
            "shirt9": "Lacoste Pique Polo Shirt",
            "shirt10": "Gant Heathered Twill Shirt",
            "pants1": "Levi's 511 Slim Jeans",
            "pants2": "Dockers Alpha Khaki",
            "pants3": "Uniqlo Selvedge Denim",
            "pants4": "Zara Chino Trousers",
            "pants5": "Dickies 874 Work Pant"
        }
    }

    # Price ranges for domains (approx in INR)
    price_ranges = {
        "Body Care": (150, 1500),
        "Clothing": (499, 4499),
        "Electronics": (1999, 89999),
        "Medicines": (45, 1800),
        "Shoes": (999, 12999),
        "Stationery": (15, 850)
    }

    print(f"Clearing existing products to re-seed with names...")
    Product.objects.all().delete()

    for domain in domains:
        category, created = Category.objects.get_or_create(
            name=domain,
            defaults={'description': f"Premium {domain} collection curated by NexCart AI."}
        )
        print(f"\nProcessing Category: {domain}")

        domain_path = base_image_dir / domain
        if not domain_path.exists():
            continue

        image_extensions = ['*.jpg', ['*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']]
        images = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']:
            images.extend(list(domain_path.glob(ext)))

        for img_path in images:
            stem = img_path.stem
            
            # Use mapping if available, otherwise fallback
            domain_map = product_mapping.get(domain, {})
            product_name = domain_map.get(stem, stem.replace('-', ' ').replace('_', ' ').title())

            price = random.randint(*price_ranges.get(domain, (100, 1000)))
            
            # Metadata generation
            description = f"Experience the pinnacle of {domain} with the {product_name}. "
            if domain == "Electronics":
               description += "Featuring high-performance hardware and seamless integration for modern living."
            elif domain == "Medicines":
               description += "Clinically tested formula designed for reliable results and trusted care."
            elif domain == "Shoes":
               description += "Engineered for maximum comfort and timeless style, perfect for any journey."
            else:
               description += f"A premium addition to your daily routine, chosen by our LSTM network for its exceptional quality."

            product = Product.objects.create(
                category=category,
                name=product_name,
                description=description,
                price=price,
                stock_quantity=random.randint(20, 150)
            )

            try:
                with open(img_path, 'rb') as f:
                    product.image.save(img_path.name, File(f), save=True)
                print(f"  [+] Added: {product_name} (₹{price})")
            except Exception as e:
                print(f"  [x] Error: {str(e)}")

if __name__ == "__main__":
    seed_products()
