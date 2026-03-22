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
def sync_order_status_to_ledger(sender, instance, **kwargs):
    """
    Automatically synchronize the database status with the blockchain ledger.
    Mapping:
      - 'Arriving Tomorrow' -> 1 (Shipped)
      - 'Delivered' -> 2 (Arrived)
    """
    status_map = {
        'Arriving Tomorrow': 1,
        'Delivered': 2,
    }

    if instance.status in status_map:
        blockchain_status = status_map[instance.status]
        order_id = instance.razorpay_order_id
        
        if not order_id:
            return

        print(f"[Automation] Triggering Blockchain Sync for {order_id} -> {instance.status}...")
        
        # Determine paths
        blockchain_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'blockchain')
        script_path = os.path.join(blockchain_dir, 'scripts', 'syncOrder.js')
        
        # Build environment for the script
        sync_env = os.environ.copy()
        sync_env["ORDER_ID"] = str(order_id)
        sync_env["ORDER_STATUS"] = str(blockchain_status)

        try:
            # Execute Hardhat script
            # We use subprocess.Popen to avoid blocking the main thread if it's slow,
            # but for a signal we might want to wait or use a celery task.
            # To keep it simple and immediate for the user, we run synchronously.
            subprocess.Popen(
                ["npx", "hardhat", "run", "scripts/syncOrder.js", "--network", "sepolia"],
                cwd=blockchain_dir,
                env=sync_env,
                shell=True
            )
            print(f"[Automation] Pulse sent for Order {order_id}.")
        except Exception as e:
            print(f"[Automation] Sync Error: {e}")
