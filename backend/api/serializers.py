from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem, Recommendation

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'phone_number', 'address', 'city', 'pincode', 'profile_picture', 'is_email_verified']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Check if email is verified
        if not self.user.profile.is_email_verified:
            raise serializers.ValidationError({
                "detail": "Account verification required. Please check your email for the security code."
            })
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price_at_purchase']

from django.utils import timezone
import datetime

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'created_at', 'items', 'razorpay_order_id']

    def get_status(self, obj):
        # Call the model method to ensure the DB field matches reality
        # This will trigger the blockchain sync signal if the status changes
        obj.update_realtime_status()
        return obj.status

class RecommendationSerializer(serializers.ModelSerializer):
    recommended_product = ProductSerializer(read_only=True)
    class Meta:
        model = Recommendation
        fields = ['id', 'recommended_product', 'score', 'generated_at']
