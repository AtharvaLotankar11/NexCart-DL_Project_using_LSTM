import os
import json
import numpy as np
import tensorflow as tf
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import OrderItem, Product
from .serializers import ProductSerializer

# Load LSTM Artifacts (Lazy loading for performance)
_model = None
_mappings = None

def get_recommendation_engine():
    global _model, _mappings
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), '../../ml-model/models/nexcart_lstm.h5')
        mapping_path = os.path.join(os.path.dirname(__file__), '../../ml-model/models/mappings.json')
        
        if os.path.exists(model_path) and os.path.exists(mapping_path):
            _model = tf.keras.models.load_model(model_path)
            with open(mapping_path, 'r') as f:
                _mappings = json.load(f)
        else:
            print("ML Artifacts not found. Prediction disabled.")
    return _model, _mappings

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_recommendations(request):
    model, mappings = get_recommendation_engine()
    
    # 1. Fetch User Interaction History (Real orders)
    # We'll get unique product IDs the user has bought
    user_orders = OrderItem.objects.filter(order__user=request.user).order_by('order__created_at')
    
    if user_orders.count() < 5:
        return Response({'reason': 'Minimum 5 interactions required for LSTM activation', 'count': user_orders.count()}, status=status.HTTP_200_OK)
    
    if not model or not mappings:
        return Response({'error': 'Intelligence hub offline'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    # 2. Preprocess History for LSTM
    # We take the last 10 products. If less, we pad.
    product_ids_bought = list(user_orders.values_list('product_id', flat=True))
    
    # Filter only those that exist in our mapping
    valid_ids = [pid for pid in product_ids_bought if str(pid) in mappings['id_to_idx']]
    
    if not valid_ids:
        # Fallback to random popular items
        fallback = Product.objects.all()[:5]
        return Response(ProductSerializer(fallback, many=True).data)

    # Map to indices and pad
    id_to_idx = mappings['id_to_idx']
    idx_to_id = mappings['idx_to_id']
    seq_len = mappings['sequence_length']
    
    sequence = [id_to_idx[str(pid)] for pid in valid_ids][-seq_len:]
    if len(sequence) < seq_len:
        sequence = [0] * (seq_len - len(sequence)) + sequence
        
    # 3. Predict Top 5 Candidates
    X = np.array([sequence])
    predictions = model.predict(X, verbose=0)[0]
    
    # Sort and filter already visited products
    # Requirement: "Recommendations must be previously unvisited items"
    top_indices = np.argsort(predictions)[::-1] # High to low probability
    visited_ids = set(product_ids_bought)
    
    recommended_ids = []
    for idx in top_indices:
        pid = int(idx_to_id[str(idx)])
        if pid not in visited_ids:
            recommended_ids.append(pid)
        if len(recommended_ids) >= 5:
            break
            
    # 4. Return Serialized Products
    recommended_products = Product.objects.filter(id__in=recommended_ids)
    serializer = ProductSerializer(recommended_products, many=True)
    
    return Response(serializer.data)
