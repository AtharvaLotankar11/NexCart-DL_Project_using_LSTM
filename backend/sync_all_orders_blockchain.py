"""
One-time script to sync all existing orders to blockchain.
Creates orders that don't exist, then updates their status.
"""
import os
import django
import subprocess
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Order

def sync_order_to_blockchain(order):
    """Create and sync a single order to blockchain"""
    order_id = order.razorpay_order_id
    if not order_id:
        print(f"⚠ Skipping Order {order.id} - no razorpay_order_id")
        return False
    
    blockchain_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'blockchain')
    sync_env = os.environ.copy()
    sync_env["ORDER_ID"] = str(order_id)
    
    print(f"\n📦 Processing Order {order_id} (Status: {order.status})...")
    
    # Step 1: Create order on blockchain
    print(f"  → Creating on blockchain...")
    try:
        result = subprocess.run(
            ["npx", "hardhat", "run", "scripts/createOrder.js", "--network", "sepolia"],
            cwd=blockchain_dir,
            env=sync_env,
            shell=True,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            print(f"  ✓ Created successfully")
        elif "Order already exists" in result.stderr:
            print(f"  ℹ Already exists")
        else:
            print(f"  ✗ Failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False
    
    # Step 2: Update status if not Pending
    status_map = {
        'Arriving Tomorrow': 1,
        'Delivered': 2,
    }
    
    if order.status in status_map:
        blockchain_status = status_map[order.status]
        sync_env["ORDER_STATUS"] = str(blockchain_status)
        
        print(f"  → Updating status to {order.status} ({blockchain_status})...")
        try:
            result = subprocess.run(
                ["npx", "hardhat", "run", "scripts/syncOrder.js", "--network", "sepolia"],
                cwd=blockchain_dir,
                env=sync_env,
                shell=True,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print(f"  ✓ Status updated successfully")
                return True
            else:
                print(f"  ✗ Failed: {result.stderr}")
                return False
        except Exception as e:
            print(f"  ✗ Error: {e}")
            return False
    else:
        print(f"  ℹ Status is {order.status}, no update needed")
        return True

def main():
    # Get all orders with razorpay_order_id (actual paid orders)
    all_orders = Order.objects.exclude(razorpay_order_id__isnull=True).exclude(razorpay_order_id='')
    total = all_orders.count()
    
    print(f"\n{'='*60}")
    print(f"🔄 BLOCKCHAIN SYNC - Syncing {total} orders")
    print(f"{'='*60}")
    
    success_count = 0
    fail_count = 0
    
    for i, order in enumerate(all_orders, 1):
        print(f"\n[{i}/{total}]", end=" ")
        if sync_order_to_blockchain(order):
            success_count += 1
        else:
            fail_count += 1
    
    print(f"\n\n{'='*60}")
    print(f"✅ COMPLETE: {success_count} succeeded, {fail_count} failed")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
