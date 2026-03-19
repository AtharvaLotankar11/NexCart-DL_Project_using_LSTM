from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from .models import Order, OrderItem

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_analytics(request):
    user = request.user

    # 1. Transaction History (Line Chart data)
    # Sum of total_amount grouped by date
    timeline_data = Order.objects.filter(user=user) \
        .annotate(date=TruncDate('created_at')) \
        .values('date') \
        .annotate(total=Sum('total_amount')) \
        .order_by('date')

    # 2. Category Distribution (Pie/Bar Chart data)
    # Count of products ordered per category
    category_data = OrderItem.objects.filter(order__user=user) \
        .values('product__category__name') \
        .annotate(count=Count('product__category__name')) \
        .order_by('-count')

    return Response({
        'timeline': timeline_data,
        'categories': category_data
    })
