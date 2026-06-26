from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals
        
        # Run order status update on startup (in a separate thread to not block startup)
        import threading
        def update_orders_on_startup():
            try:
                from django.core.management import call_command
                import time
                time.sleep(3)  # Wait for Django to fully start
                print("\n[Startup] Checking order statuses...")
                call_command('update_order_statuses')
            except Exception as e:
                print(f"[Startup] Order update warning: {e}")
        
        # Only run in the main process, not in reloader process
        import os
        if os.environ.get('RUN_MAIN') == 'true':
            threading.Thread(target=update_orders_on_startup, daemon=True).start()

