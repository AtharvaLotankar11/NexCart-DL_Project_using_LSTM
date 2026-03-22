import os
import json
import numpy as np
import tensorflow as tf
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import OrderItem, Product, Recommendation
from .serializers import ProductSerializer

# Load LSTM Artifacts (Lazy loading for performance)
_model = None
_mappings = None

class CompatibleEmbedding(tf.keras.layers.Embedding):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        super().__init__(*args, **kwargs)

class CompatibleLSTM(tf.keras.layers.LSTM):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        super().__init__(*args, **kwargs)

class CompatibleDense(tf.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop('quantization_config', None)
        super().__init__(*args, **kwargs)

def get_recommendation_engine():
    """Returns (model, mappings) for the recommendation system."""
    global _model, _mappings
    mapping_path = os.path.join(os.path.dirname(__file__), '../../ml-model/models/mappings.json')
    
    # Always re-read mappings for live data sync
    if os.path.exists(mapping_path):
        try:
            with open(mapping_path, 'r') as f:
                _mappings = json.load(f)
        except Exception:
            pass

    if _model is None: # Lazy load model (stayed the same)
        model_path = os.path.join(os.path.dirname(__file__), '../../ml-model/models/nexcart_lstm.h5')
        if os.path.exists(model_path):
            try:
                _model = tf.keras.models.load_model(
                    model_path, 
                    custom_objects={
                        'Embedding': CompatibleEmbedding,
                        'LSTM': CompatibleLSTM,
                        'Dense': CompatibleDense
                    }
                )
            except Exception:
                _model = None
    return _model, _mappings

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_recommendations(request):
    model, mappings = get_recommendation_engine()
    
    # 1. Fetch User Interaction History (Real orders)
    user_orders = OrderItem.objects.filter(order__user=request.user).order_by('order__created_at')
    
    if user_orders.count() < 5:
        return Response({'reason': 'Minimum 5 interactions required for LSTM activation', 'count': user_orders.count()}, status=status.HTTP_200_OK)
    
    if not model or not mappings:
        return Response({'error': 'Intelligence hub offline'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    # 2. Identify favorite categories for boosting (Logical Bridge)
    from django.db.models import Count, Case, When
    fav_cat_data = user_orders.values('product__category__name')\
                                .annotate(count=Count('product__category__name'))\
                                .order_by('-count')
    
    fav_categories = [item['product__category__name'] for item in fav_cat_data]
    print(f"[AI Debug] User {request.user.id} interests (sorted): {fav_categories}")

    # 3. Preprocess History for LSTM
    product_ids_bought = list(user_orders.values_list('product_id', flat=True))
    visited_ids = set(product_ids_bought)
    
    # Map raw IDs to logical indices for the model
    # We use a best-effort mapping to avoid ID drift issues
    id_to_idx = mappings['id_to_idx']
    idx_to_id = mappings['idx_to_id']
    seq_len = mappings['sequence_length']
    
    sequence = [id_to_idx.get(str(pid), 0) for pid in product_ids_bought][-seq_len:]
    if len(sequence) < seq_len:
        sequence = [0] * (seq_len - len(sequence)) + sequence 
        
    # 4. Predict Top Candidates
    X = np.array([sequence])
    predictions = model.predict(X, verbose=0)[0]
    top_indices = np.argsort(predictions)[::-1] 
    
    # 5. Build Result List with Preference Boosting
    recommended_ids = []
    secondary_ids = []
    
    # Collect candidates from model
    for idx in top_indices:
        idx_str = str(idx)
        if idx_str not in idx_to_id: continue
        pid = int(idx_to_id[idx_str])
        if pid in visited_ids: continue
        
        try:
            p_obj = Product.objects.get(id=pid)
            # If product belongs to any of user's top categories, boost it
            if p_obj.category.name in fav_categories:
                recommended_ids.append(pid)
            else:
                secondary_ids.append(pid)
        except Exception:
            continue
            
        if len(recommended_ids) + len(secondary_ids) >= 15: break

    # Blend: Boosted items first, then others
    final_ids = (recommended_ids + secondary_ids)[:5]
    print(f"[AI Debug] Final IDs pushed to frontend: {final_ids}")
            
    # 6. Preserve original recommendation order (Logic Sort)
    if not final_ids:
        # Hard fallback logic
        if fav_categories:
            # Case: User has orders, but LSTM failed to find more
            fallback = Product.objects.filter(category__name__in=fav_categories).exclude(id__in=visited_ids)[:5]
            score = 0.5
        else:
            # Case: Cold Start (User has 0 history) - recommend recent/top products
            fallback = Product.objects.all().order_by('-created_at')[:5]
            score = 0.1 # Indicator for "General Trending"
            
        # Persist fallback for admin visibility
        Recommendation.objects.filter(user=request.user).delete()
        for p_fallback in fallback:
            Recommendation.objects.create(user=request.user, recommended_product=p_fallback, score=score)
            
        return Response(ProductSerializer(fallback, many=True).data)

    preserved_order = Case(*[When(id=pk, then=pos) for pos, pk in enumerate(final_ids)])
    recommended_products = Product.objects.filter(id__in=final_ids).order_by(preserved_order)
    
    # 7. Persistence: Save recommendations for Admin view
    # Clear old ones first for a fresh 'snapshot' or use update_or_create
    # To keep the Admin clean but relevant, we'll store the top 5
    Recommendation.objects.filter(user=request.user).delete()
    for product in recommended_products:
        Recommendation.objects.create(
            user=request.user,
            recommended_product=product,
            score=0.95 # Generic high-confidence score for LSTM results
        )

    serializer = ProductSerializer(recommended_products, many=True)
    return Response(serializer.data)
