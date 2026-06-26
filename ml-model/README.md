```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         🤖 THE NEURAL CORE - AI/ML LAYER 🤖                │
│                                                             │
│    "Where patterns become predictions, data becomes        │
│     foresight, and machines learn what humans desire"      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)

---

## 🎭 The Philosophy

Picture a shopkeeper who remembers every customer's preferences. They notice patterns: "Sarah buys running shoes every spring." "Marcus always follows electronics with accessories." "Priya purchases baby care products in clusters."

That's human intuition. Now imagine encoding that intuition into mathematics—patterns extracted from thousands of purchases, distilled into numerical weights, and executed in milliseconds.

That's the Neural Core: an **LSTM-powered recommendation engine** that learns from collective shopping behavior to predict individual futures.

---

## 🏗️ Architectural DNA

```
┌────────────────────────────────────────────────────┐
│  Historical Purchase Data (User-Product Pairs)     │
│  ↓                                                  │
│  Sequence Generation (Time-Ordered Interactions)   │
│  ↓                                                  │
│  LSTM Neural Network (Pattern Recognition)         │
│  ↓                                                  │
│  Product Probability Distribution (Predictions)    │
│  ↓                                                  │
│  Top-K Recommendations (Highest Confidence)        │
│  ↓                                                  │
│  Django API Endpoint (JSON Response)               │
└────────────────────────────────────────────────────┘
```

**Model Type:** Long Short-Term Memory (LSTM) Recurrent Neural Network  
**Framework:** TensorFlow 2.x / Keras  
**Input:** Sequential purchase history (user → product sequences)  
**Output:** Next-purchase probability distribution  
**Training Data:** Synthetic user interaction logs  

---

## 📁 Directory Topology

```
ml-model/
├── data/
│   └── user_interactions.csv    # Training data (user_id, product_id, timestamp)
│
├── models/
│   ├── nexcart_lstm.h5          # Trained model weights (HDF5 format)
│   └── mappings.json            # Product ID ↔ Model index mapping
│
├── generate_synthetic_data.py   # Creates realistic purchase sequences
├── preprocess_and_train.py      # Builds and trains LSTM model
└── train_log.txt                # Training history (loss, accuracy)
```

---

## 🧠 The LSTM Architecture

### Why LSTM? Why Not Simple Regression?

**The Problem:**  
Purchases aren't independent events. Buying a laptop predicts future purchases of a mouse, keyboard, laptop bag. Order matters. Time matters. Context matters.

**Traditional ML fails here:**  
- Logistic regression: Treats purchases as isolated
- Random forests: Ignore sequential dependencies
- CNNs: Designed for spatial data (images), not temporal

**LSTM excels:**  
- Remembers long-term dependencies (laptop → accessories weeks later)
- Handles variable-length sequences (some users buy 5 items, others 50)
- Captures temporal patterns (holiday shopping spikes, seasonal trends)

---

### Model Layers (The Neural Pipeline)

```
Input: [product_1, product_2, product_3, ...]
  ↓
Embedding Layer (256 dimensions)
  • Converts product IDs to dense vectors
  • Similar products cluster in vector space
  ↓
LSTM Layer 1 (128 units)
  • Learns short-term patterns (immediate follow-ups)
  • Remembers previous 5-10 purchases
  ↓
LSTM Layer 2 (64 units)
  • Learns long-term patterns (monthly cycles)
  • Condenses information from LSTM-1
  ↓
Dense Output Layer (Softmax, 90 neurons)
  • One neuron per product
  • Outputs probability distribution
  ↓
Output: [0.02, 0.001, 0.15, ..., 0.08]
  • Probabilities sum to 1.0
  • Top 5 = Recommendations
```

---

### Hyperparameters (The Tuning Dials)

**Embedding Dimension:** 256  
How richly to represent each product. Higher = more expressive, slower training.

**LSTM Units (Layer 1):** 128  
Memory capacity. More units = remembers more context.

**LSTM Units (Layer 2):** 64  
Compression layer. Distills patterns from Layer 1.

**Sequence Length:** 10  
How many past purchases to consider per prediction.

**Batch Size:** 64  
Number of training examples processed simultaneously.

**Epochs:** 50  
Complete passes through training data.

**Optimizer:** Adam (adaptive learning rate)

**Loss Function:** Sparse Categorical Crossentropy  
Measures prediction error (actual next product vs predicted distribution).

---

## 🔬 Training Process

### Step 1: Generate Synthetic Data

**Script:** `generate_synthetic_data.py`

**Why synthetic?**  
Real user data doesn't exist yet. Bootstrap model with realistic purchase patterns.

**Pattern Templates:**
1. **Category Consistency:** Users stick to categories (Electronics buyers stay in Electronics)
2. **Complementary Products:** Laptops → mice, shoes → socks
3. **Temporal Clustering:** Purchases happen in bursts (weekend shopping)
4. **Random Exploration:** Occasional cross-category purchases

**Output:** `data/user_interactions.csv`

Format:
```csv
user_id,product_id,timestamp
1,42,2026-01-15 10:23:45
1,87,2026-01-16 14:12:03
2,15,2026-01-15 11:05:22
...
```

---

### Step 2: Preprocess & Train

**Script:** `preprocess_and_train.py`

**Preprocessing:**
1. **Load CSV:** Read user interactions
2. **Sequence Generation:**
   - Slide window over each user's purchases
   - Window size = 10 (predict 11th item from previous 10)
   - Example: [prod_1, prod_2, ..., prod_10] → prod_11
3. **Index Mapping:**
   - Convert product IDs to 0-based indices
   - Save mapping to `models/mappings.json`
4. **Train/Test Split:** 80% training, 20% validation

**Training:**
1. **Initialize Model:** Build LSTM architecture
2. **Compile:** Set optimizer, loss function, metrics
3. **Fit:** Feed training data for 50 epochs
4. **Validate:** Check accuracy on unseen data
5. **Save:** Export weights to `models/nexcart_lstm.h5`

**Training Logs:**  
Loss decreases from ~4.5 → ~2.1 over epochs (model learns patterns).

---

### Step 3: Sync Mappings with Database

**Script:** `backend/update_mappings.py`

**Problem:**  
Model indices (0, 1, 2...) don't match database product IDs (arbitrary integers).

**Solution:**  
Update `mappings.json` to map model indices → real DB IDs.

**Example mapping:**
```json
{
  "0": 15,   // Model index 0 = Product ID 15
  "1": 27,   // Model index 1 = Product ID 27
  ...
}
```

**When to run:**  
After seeding database, before serving recommendations.

---

## 🔮 Inference: From History to Prediction

### The API Flow

**Endpoint:** `GET /api/user-recommendations/`

**Authentication:** Required (JWT token)

**Request:** Empty (user ID extracted from token)

**Response:**
```json
[
  {
    "product": {
      "id": 42,
      "name": "Wireless Mouse",
      "price": "25.99",
      "category": "Electronics"
    },
    "score": 0.87
  },
  ...
]
```

---

### Behind the Scenes

**File:** `backend/api/recommendation_view.py`

**Process:**

1. **Fetch User's Purchase History**
   ```python
   orders = Order.objects.filter(user=request.user).order_by('created_at')
   purchased_products = [item.product.id for order in orders for item in order.items]
   ```

2. **Convert Product IDs to Model Indices**
   ```python
   reverse_mapping = {db_id: idx for idx, db_id in mappings.items()}
   sequence = [reverse_mapping[pid] for pid in purchased_products[-10:]]
   ```

3. **Pad Sequence** (if fewer than 10 purchases)
   ```python
   sequence = ([0] * (10 - len(sequence))) + sequence
   ```

4. **Run Inference**
   ```python
   predictions = model.predict([sequence])  # Shape: (1, 90)
   top_indices = predictions.argsort()[-5:][::-1]  # Top 5 highest probabilities
   ```

5. **Map Back to Product IDs**
   ```python
   recommended_ids = [mappings[str(idx)] for idx in top_indices]
   products = Product.objects.filter(id__in=recommended_ids)
   ```

6. **Serialize & Return**
   ```python
   return Response([{
       'product': ProductSerializer(p).data,
       'score': float(predictions[0][idx])
   } for p, idx in zip(products, top_indices)])
   ```

---

## 📊 Model Performance Metrics

**Training Accuracy:** ~65%  
(On synthetic data. Real-world may differ.)

**Validation Loss:** ~2.1  
Lower = better predictions.

**Inference Speed:** ~50ms per user  
Fast enough for real-time API calls.

**Cold Start Problem:**  
New users (0 purchases) receive random recommendations weighted by product popularity.

---

## 🎯 The Recommendation Strategy

### Scenario 1: New User (No Purchase History)

**Challenge:** No data to predict from.

**Solution:**  
- Return top-selling products across all categories
- OR: Random selection from each category (diverse exposure)

**Implemented Approach:**  
Fallback to trending products (logged in analytics).

---

### Scenario 2: Sparse Data (1-5 Purchases)

**Challenge:** Insufficient sequence length for LSTM.

**Solution:**  
- Pad sequence with zeros (model trained to handle this)
- Weight recent purchases higher
- Blend LSTM output with category-based fallback

---

### Scenario 3: Rich Data (10+ Purchases)

**Challenge:** None. This is the sweet spot.

**Solution:**  
Pure LSTM predictions. Model has enough context to make confident suggestions.

---

## 🛠️ Development Commands

**Generate synthetic training data:**
```bash
cd ml-model
python generate_synthetic_data.py
# Creates data/user_interactions.csv
```

**Train LSTM model:**
```bash
python preprocess_and_train.py
# Outputs:
#  - models/nexcart_lstm.h5
#  - models/mappings.json
#  - train_log.txt
```

**Sync mappings with database:**
```bash
cd ../backend
python update_mappings.py
# Updates ml-model/models/mappings.json with real DB IDs
```

**Test recommendations (Django shell):**
```bash
python manage.py shell
```
```python
from api.recommendation_view import get_recommendations
from django.contrib.auth.models import User

user = User.objects.get(username='testuser')
recs = get_recommendations(user)
print(recs)
```

---

## 🔍 Debugging & Troubleshooting

**Issue:** Model returns random recommendations  
**Cause:** Mappings not synced with database  
**Solution:** Run `update_mappings.py`

**Issue:** `FileNotFoundError: nexcart_lstm.h5`  
**Cause:** Model not trained yet  
**Solution:** Run `preprocess_and_train.py`

**Issue:** All recommendations are same product  
**Cause:** Training data lacks diversity  
**Solution:** Regenerate synthetic data with more variety

**Issue:** Recommendations ignore recent purchases  
**Cause:** Sequence not sorted by timestamp  
**Solution:** Ensure `order_by('created_at')` in query

---

## 🚀 Performance Optimizations

**1. Model Caching**  
Load model once at Django startup (not per request).  
Implemented via global variable in `recommendation_view.py`.

**2. Batch Inference**  
If serving recommendations to multiple users, predict in batches.  
Current: One-by-one (acceptable for <100 concurrent users).

**3. Precomputed Embeddings**  
Cache product embeddings (first layer output).  
Saves computation when user history is identical.

**4. GPU Acceleration**  
TensorFlow automatically uses GPU if available.  
For CPU-only: Consider ONNX Runtime (faster inference).

---

## 🔮 Future Enhancements

**1. Collaborative Filtering Hybrid**  
Combine LSTM with user-user similarity (users with similar histories get similar recommendations).

**2. Real-Time Model Updates**  
Retrain model weekly as new purchase data accumulates.

**3. Contextual Features**  
Incorporate time of day, day of week, season (predict Christmas shopping patterns).

**4. Attention Mechanisms**  
Transformer-based model (like GPT but for shopping) to weigh important past purchases.

**5. Multi-Task Learning**  
Simultaneously predict: next product, purchase timing, cart value.

**6. Explainability**  
Show users WHY a product was recommended ("Based on your laptop purchase...").

**7. A/B Testing Framework**  
Compare LSTM vs rule-based vs random recommendations (measure conversion lift).

---

## 🎓 LSTM Concepts for Humans

### The Memory Cell 🧠

**Metaphor:** A notebook where you can:
- Write new information (input gate)
- Erase irrelevant old info (forget gate)
- Read current context (output gate)

**Example:**  
User buys [laptop, mouse, keyboard, monitor].  
LSTM remembers "Electronics streak" but forgets "irrelevant product from 3 months ago."

---

### Sequential Dependencies 🔗

**Metaphor:** Reading a story vs reading random sentences.

**Non-sequential (bad):**  
"Dragon, slayed, knight, the" → Nonsense.

**Sequential (good):**  
"The knight slayed the dragon" → Meaning emerges from order.

**In shopping:**  
[Laptop] → [Mouse] makes sense.  
[Mouse] → [Laptop] is less common (laptops come with trackpads).

---

### Embedding Space 🗺️

**Metaphor:** A map where similar products live close together.

**Visualization:**
```
Electronics Neighborhood:
  Laptop ---- Mouse ---- Keyboard
      \        /
       \      /
        Monitor

Baby Care Neighborhood:
  Diapers ---- Baby Food ---- Toys
```

**How it helps:**  
If model learns "Laptop → Mouse" pattern, it generalizes to "Laptop → Keyboard" (same neighborhood).

---

### Training vs Inference ⚙️ vs 🚀

**Training (one-time, expensive):**  
Show model 10,000 examples.  
Adjust weights to minimize prediction error.  
Takes hours on GPU.

**Inference (real-time, cheap):**  
Given user history, predict next purchase.  
Uses pre-trained weights (no adjustment).  
Takes milliseconds.

**Metaphor:**  
Training = Medical school (years of study).  
Inference = Doctor diagnosing patient (minutes).

---

## 🎯 The Neural Core's Sacred Duty

**Duty 1: Pattern Recognition**  
Identify invisible correlations humans miss (statistical associations across thousands of users).

**Duty 2: Personalization**  
Each user gets unique recommendations (their history, their predictions).

**Duty 3: Continuous Learning**  
As users shop, model improves (more data = better patterns).

**Duty 4: Serendipity**  
Occasionally recommend unexpected products (avoid filter bubbles).

**Duty 5: Speed**  
Predictions in milliseconds (users won't wait for slow AI).

---

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "The Neural Core doesn't guess—it learns. It doesn't       │
│   assume—it infers. It doesn't generalize—it personalizes." │
│                                                             │
│                  — The Machine Learning Architects          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)
