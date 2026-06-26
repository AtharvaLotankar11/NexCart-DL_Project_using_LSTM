"""
Django management command to update order statuses based on time elapsed.
This ensures orders automatically transition through statuses even when the app is closed.

Usage:
    python manage.py update_order_statuses

Can be run manually or scheduled with:
    - Windows Task Scheduler (run every hour)
    - Cron job (Linux/Mac)
    - Celery Beat (if using Celery)
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Order
import datetime


class Command(BaseCommand):
    help = 'Updates order statuses based on time elapsed since creation'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without actually updating',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('🔄 Order Status Update Task'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING('⚠️  DRY RUN MODE - No changes will be made\n'))
        
        # Get all non-cancelled orders that might need updating
        orders = Order.objects.exclude(status='Cancelled').exclude(status='Delivered')
        
        self.stdout.write(f'📊 Found {orders.count()} orders to check\n')
        
        updated_count = 0
        now = timezone.now()
        
        for order in orders:
            time_passed = now - order.created_at
            old_status = order.status
            
            # Calculate what the status should be
            new_status = old_status
            if time_passed > datetime.timedelta(hours=24):
                new_status = 'Delivered'
            elif time_passed > datetime.timedelta(minutes=1):
                if order.status == 'Pending':
                    new_status = 'Arriving Tomorrow'
            
            # If status needs updating
            if old_status != new_status:
                hours_passed = time_passed.total_seconds() / 3600
                
                if dry_run:
                    self.stdout.write(
                        f'  🔍 Order {order.razorpay_order_id or order.id}: '
                        f'{old_status} → {new_status} '
                        f'(after {hours_passed:.1f}h)'
                    )
                else:
                    order.status = new_status
                    order.save(update_fields=['status'])  # This triggers the signal → blockchain sync
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'  ✓ Order {order.razorpay_order_id or order.id}: '
                            f'{old_status} → {new_status} '
                            f'(after {hours_passed:.1f}h)'
                        )
                    )
                
                updated_count += 1
        
        self.stdout.write('\n' + '='*60)
        if dry_run:
            self.stdout.write(self.style.WARNING(f'📋 Would update {updated_count} orders'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✅ Updated {updated_count} orders'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
