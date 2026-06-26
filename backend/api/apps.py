from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals
        
        # Run order status update on startup and periodically
        import threading
        import time
        
        def update_orders_periodically():
            """Background task that updates order statuses every 60 seconds"""
            try:
                from django.core.management import call_command
                time.sleep(5)  # Initial wait for Django to fully start
                
                print("\n[Startup] Checking order statuses...")
                call_command('update_order_statuses')
                
                # Then check every 60 seconds
                while True:
                    time.sleep(60)  # Check every minute
                    print("\n[Periodic Check] Updating order statuses...")
                    call_command('update_order_statuses')
                    
            except Exception as e:
                print(f"[Background Task] Order update error: {e}")
        
        # Only run in the main process, not in reloader process
        import os
        if os.environ.get('RUN_MAIN') == 'true':
            threading.Thread(target=update_orders_periodically, daemon=True).start()

