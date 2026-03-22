import os
import django
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Product, Category

def update_mappings():
    # 1. Path to mappings.json
    mapping_path = os.path.join(os.path.dirname(__file__), '../ml-model/models/mappings.json')
    
    if not os.path.exists(mapping_path):
        print(f"Mapping not found at {mapping_path}")
        return
        
    with open(mapping_path, 'r') as f:
        mappings = json.load(f)
        
    # 2. Clusters as defined in generate_synthetic_data.py
    # 1-15: Body Care, 16-30: Clothing, 31-45: Electronics, 46-60: Medicines, 61-75: Shoes, 76-90: Stationery
    clusters = {
        "Body Care": range(1, 16),
        "Clothing": range(16, 31),
        "Electronics": range(31, 46),
        "Medicines": range(46, 61),
        "Shoes": range(61, 76),
        "Stationery": range(76, 91)
    }
    
    new_id_to_idx = {}
    new_idx_to_id = {}
    
    # 3. Process every product in existing DB
    all_products = Product.objects.all().select_related('category')
    print(f"Mapping {all_products.count()} products from Database...")
    
    # Track used indices per category to spread them out
    category_index_counters = {cat: list(indices) for cat, indices in clusters.items()}
    
    for product in all_products:
        cat_name = product.category.name
        if cat_name in category_index_counters and category_index_counters[cat_name]:
            # Assign first available index from this category's cluster
            idx = category_index_counters[cat_name].pop(0)
            new_id_to_idx[str(product.id)] = idx
            new_idx_to_id[str(idx)] = product.id
        else:
            # Fallback for overflow or unknown categories
            pass

    # 4. Update the actual mappings object
    mappings['id_to_idx'] = new_id_to_idx
    mappings['idx_to_id'] = new_idx_to_id
    
    # 5. Write back to disk
    with open(mapping_path, 'w') as f:
        json.dump(mappings, f)
        
    print(f"SUCCESS: mappings.json updated with {len(new_id_to_idx)} live database products!")

if __name__ == "__main__":
    update_mappings()
