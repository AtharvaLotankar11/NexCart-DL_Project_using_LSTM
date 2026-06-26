from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, Cart, Order
import os
import subprocess

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)
        Cart.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Ensure profile and cart exist even for users created without them
    UserProfile.objects.get_or_create(user=instance)
    Cart.objects.get_or_create(user=instance)
    if hasattr(instance, 'profile'):
        instance.profile.save()

@receiver(post_save, sender=Order)
def sync_order_status_to_ledger(sender, instance, created, **kwargs):
    """
    Automatically synchronize the database status with the blockchain ledger.
    - When order is first created: Create it on blockchain with Pending status
    - When status changes: Update blockchain status
    Mapping:
      - 'Pending' -> 0 (Pending) 
      - 'Arriving Tomorrow' -> 1 (Shipped)
      - 'Delivered' -> 2 (Arrived)
    """
    order_id = instance.razorpay_order_id
    
    if not order_id:
        return

    # Determine paths
    blockchain_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'blockchain')
    
    # Build environment for the script
    sync_env = os.environ.copy()
    sync_env["ORDER_ID"] = str(order_id)

    # Step 1: If this is a new order or status is Pending, create it on blockchain first
    if created or instance.status == 'Pending':
        print(f"[Automation] Creating Order {order_id} on blockchain...")
        
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
                print(f"[Automation] ✓ Order {order_id} created on blockchain.")
            else:
                # Check if order already exists
                if "Order already exists" in result.stderr:
                    print(f"[Automation] ℹ Order {order_id} already exists on blockchain.")
                else:
                    print(f"[Automation] ✗ Failed to create order on blockchain")
                    print(f"[Automation] Error: {result.stderr}")
                    return
                    
        except subprocess.TimeoutExpired:
            print(f"[Automation] ✗ Order creation timed out for {order_id}")
            return
        except Exception as e:
            print(f"[Automation] ✗ Order creation error: {e}")
            return

    # Step 2: Update status if it's not Pending
    status_map = {
        'Arriving Tomorrow': 1,
        'Delivered': 2,
    }

    if instance.status in status_map:
        blockchain_status = status_map[instance.status]
        sync_env["ORDER_STATUS"] = str(blockchain_status)

        print(f"[Automation] Updating Order {order_id} to status {instance.status}...")
        
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
                print(f"[Automation] ✓ Order {order_id} synced to blockchain successfully.")
                print(f"[Automation] Output: {result.stdout}")
            else:
                print(f"[Automation] ✗ Blockchain sync failed for Order {order_id}")
                print(f"[Automation] Error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print(f"[Automation] ✗ Blockchain sync timed out for Order {order_id} (>60s)")
        except Exception as e:
            print(f"[Automation] ✗ Sync Error: {e}")
