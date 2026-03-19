import pandas as pd
import numpy as np
import random
import os
from datetime import datetime, timedelta

def generate_user_data(num_users=1000, num_interactions=20000):
    # Simulated Product Database (90 products across 6 categories)
    # Categories: Body Care, Clothing, Electronics, Medicines, Shoes, Stationery
    product_ids = list(range(1, 91))
    
    # Mapping products to clusters for realistic patterns
    # 1-15: Body Care, 16-30: Clothing, 31-45: Electronics, 46-60: Medicines, 61-75: Shoes, 76-90: Stationery
    product_clusters = {
        "Body Care": list(range(1, 16)),
        "Clothing": list(range(16, 31)),
        "Electronics": list(range(31, 46)),
        "Medicines": list(range(46, 61)),
        "Shoes": list(range(61, 76)),
        "Stationery": list(range(76, 91))
    }
    
    cluster_names = list(product_clusters.keys())
    
    data = []
    
    start_date = datetime.now() - timedelta(days=30)
    
    for user_id in range(1, num_users + 1):
        # Assign a 'persona' (preferred category) to each user
        primary_category = random.choice(cluster_names)
        secondary_category = random.choice(cluster_names)
        
        # Number of interactions for this specific user
        user_interact_count = random.randint(5, 30)
        
        current_time = start_date + timedelta(hours=random.randint(1, 720))
        
        for _ in range(user_interact_count):
            # Choose product based on persona (80% chance for preferred categories)
            if random.random() < 0.8:
                cat = random.choice([primary_category, secondary_category])
                product_id = random.choice(product_clusters[cat])
            else:
                product_id = random.choice(product_ids)
            
            # Interaction type weighted
            # 70% view, 20% cart, 10% purchase
            rand_val = random.random()
            if rand_val < 0.7:
                action = "view"
            elif rand_val < 0.9:
                action = "cart"
            else:
                action = "purchase"
            
            data.append({
                "user_id": user_id,
                "product_id": product_id,
                "timestamp": current_time,
                "action": action
            })
            
            # Increment time for next action in sequence
            current_time += timedelta(minutes=random.randint(2, 60))
    
    df = pd.DataFrame(data)
    df = df.sort_values(by="timestamp")
    
    # Ensure directory exists
    os.makedirs('data', exist_ok=True)
    
    output_path = 'data/user_interactions.csv'
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} interactions for {num_users} users.")
    print(f"File saved to: {output_path}")
    
    return df

if __name__ == "__main__":
    generate_user_data()
