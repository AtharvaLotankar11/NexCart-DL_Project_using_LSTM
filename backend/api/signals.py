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
    - When order is CREATED in Django → Create it on blockchain first
    - When order status CHANGES → Update status on blockchain
    
    Status Mapping:
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

    # If this is a NEW order, create it on blockchain first
    if created and instance.status == 'Pending':
        print(f"[Blockchain] Creating new order {order_id} on blockchain...")
        
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
                print(f"[Blockchain] ✓ Order {order_id} created on blockchain successfully.")
                if result.stdout:
                    print(f"[Blockchain] Output: {result.stdout}")
            else:
                # Check if order already exists (idempotent operation)
                if "already exists" in result.stderr.lower():
                    print(f"[Blockchain] ℹ Order {order_id} already exists on blockchain (OK)")
                else:
                    print(f"[Blockchain] ✗ Failed to create order {order_id} on blockchain")
                    print(f"[Blockchain] Error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print(f"[Blockchain] ✗ Order creation timed out for {order_id} (>60s)")
        except Exception as e:
            print(f"[Blockchain] ✗ Creation Error: {e}")
        
        return  # Done creating, no need to update status yet

    # For status updates on existing orders
    status_map = {
        'Arriving Tomorrow': 1,
        'Delivered': 2,
    }

    if instance.status in status_map:
        blockchain_status = status_map[instance.status]
        sync_env["ORDER_STATUS"] = str(blockchain_status)

        print(f"[Blockchain] Updating order {order_id} to status '{instance.status}' (blockchain: {blockchain_status})...")
        
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
                print(f"[Blockchain] ✓ Order {order_id} status updated on blockchain successfully.")
                if result.stdout:
                    print(f"[Blockchain] Output: {result.stdout}")
            else:
                # If order doesn't exist, try to create it first
                if "Order does not exist" in result.stderr or "does not exist" in result.stderr.lower():
                    print(f"[Blockchain] ⚠ Order {order_id} not found on blockchain. Creating it now...")
                    
                    # Try to create the order first
                    create_result = subprocess.run(
                        ["npx", "hardhat", "run", "scripts/createOrder.js", "--network", "sepolia"],
                        cwd=blockchain_dir,
                        env=sync_env,
                        shell=True,
                        capture_output=True,
                        text=True,
                        timeout=60
                    )
                    
                    if create_result.returncode == 0:
                        print(f"[Blockchain] ✓ Order {order_id} created. Retrying status update...")
                        # Retry the status update
                        retry_result = subprocess.run(
                            ["npx", "hardhat", "run", "scripts/syncOrder.js", "--network", "sepolia"],
                            cwd=blockchain_dir,
                            env=sync_env,
                            shell=True,
                            capture_output=True,
                            text=True,
                            timeout=60
                        )
                        if retry_result.returncode == 0:
                            print(f"[Blockchain] ✓ Order {order_id} status updated successfully after creation.")
                        else:
                            print(f"[Blockchain] ✗ Status update failed after creation: {retry_result.stderr}")
                    else:
                        print(f"[Blockchain] ✗ Failed to create order: {create_result.stderr}")
                else:
                    print(f"[Blockchain] ✗ Status update failed for {order_id}")
                    print(f"[Blockchain] Error: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print(f"[Blockchain] ✗ Status update timed out for {order_id} (>60s)")
        except Exception as e:
            print(f"[Blockchain] ✗ Sync Error: {e}")
