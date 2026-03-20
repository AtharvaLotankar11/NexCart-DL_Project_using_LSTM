from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
import razorpay
import os
from django.conf import settings
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Recommendation
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer, 
    OrderSerializer, RecommendationSerializer
)

# Initialize Razorpay Client
razorpay_client = razorpay.Client(
    auth=(os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder'), 
          os.environ.get('RAZORPAY_KEY_SECRET', 'secret_placeholder'))
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()
        
        return Response({'status': 'Item added to cart', 'quantity': cart_item.quantity})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_razorpay_order(request):
    amount = request.data.get('amount')
    if not amount:
        return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Razorpay amount is in paise (INR 100 = 10000 paise)
    razor_amount = int(float(amount) * 100)
    
    order_data = {
        'amount': razor_amount,
        'currency': 'INR',
        'payment_capture': '1'
    }

    try:
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Create Order in our DB
        order = Order.objects.create(
            user=request.user,
            total_amount=amount,
            status='Pending',
            razorpay_order_id=razorpay_order['id']
        )
        
        # Add items from cart to OrderItem (Ensure cart exists)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price
            )
        
        return Response(razorpay_order)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_payment(request):
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }

    try:
        # Verify Signature
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Update Order Status
        order = Order.objects.get(razorpay_order_id=razorpay_order_id)
        order.status = 'Arriving Tomorrow' # Success status
        order.razorpay_payment_id = razorpay_payment_id
        order.save()
        
        # Clear User Cart
        Cart.objects.get(user=request.user).items.all().delete()
        
        return Response({'status': 'Payment Verified Successfully'})
    except Exception as e:
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def track_interaction(request):
    product_id = request.data.get('product_id')
    action_type = request.data.get('action') # view, cart, purchase
    
    # In a real app, you'd save this to an Interaction model
    # For now, we'll just log it to satisfy the requirements of data collection
    print(f"TRACK_INTERACTION: User {request.user.id} {action_type}ed Product {product_id}")
    
    return Response({'status': 'Interaction tracked'})

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user).order_by('-score')
