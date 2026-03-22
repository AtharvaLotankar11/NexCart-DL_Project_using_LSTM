from django.contrib import admin
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem, Recommendation

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'is_email_verified')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity')
    list_filter = ('category',)
    search_fields = ('name',)

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at', 'sync_ledger')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

    def get_queryset(self, request):
        """
        Force update of all statuses whenever the admin list is refreshed.
        This provides the 'real-time backend' requested.
        """
        qs = super().get_queryset(request)
        for order in qs:
            order.update_realtime_status()
        return qs

    def sync_ledger(self, obj):
        # This provides a visual indicator if it's already on Arrived (2)
        # It's a helper for the admin to see the sync state
        return obj.status
    sync_ledger.short_description = 'Sync Logic'

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'recommended_product', 'score', 'generated_at')
