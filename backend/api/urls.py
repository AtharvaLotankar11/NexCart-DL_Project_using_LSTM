from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CartViewSet, OrderViewSet, RecommendationViewSet,
    create_razorpay_order, verify_payment, track_interaction
)
from .auth_views import RegisterView, VerifyEmailView, MeView, SendOTPView, VerifyOTPView, ResetPasswordView
from .recommendation_view import get_user_recommendations
from .analytics_view import get_user_analytics

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='categories')
router.register('products', ProductViewSet, basename='products')
router.register('cart', CartViewSet, basename='cart')
router.register('orders', OrderViewSet, basename='orders')
router.register('recommendations', RecommendationViewSet, basename='recommendations')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='auth_verify_email'),
    path('auth/me/', MeView.as_view(), name='auth_me'),
    path('auth/send-otp/', SendOTPView.as_view(), name='auth_send_otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='auth_verify_otp'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='auth_reset_password'),
    
    # E-commerce and ML Endpoints
    path('create-order/', create_razorpay_order, name='create_order'),
    path('verify-payment/', verify_payment, name='verify_payment'),
    path('track-interaction/', track_interaction, name='track_interaction'),
    path('user-recommendations/', get_user_recommendations, name='user_recommendations'),
    path('user-analytics/', get_user_analytics, name='user_analytics'),
]
