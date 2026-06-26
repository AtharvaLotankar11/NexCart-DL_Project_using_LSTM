```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         🧠 THE CENTRAL HUB - BACKEND LAYER 🧠              │
│                                                             │
│     "The brain that never sleeps, the nexus of truth"      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)

---

## 🎭 The Philosophy

Picture a master conductor orchestrating a symphony. Every instrument—payments, databases, AI models, blockchain—plays at precisely the right moment. That's the backend: the invisible maestro ensuring perfect harmony.

It doesn't shout. It doesn't seek applause. It simply **works**, ensuring every click, every purchase, every prediction flows seamlessly from chaos to order.

---

## 🏗️ Architectural DNA

```
┌─────────────────────────────────────────────────────┐
│  Client Request (Frontend)                          │
│  ↓                                                   │
│  Django REST Framework (API Gateway)                │
│  ↓                                                   │
│  Business Logic (Views + Serializers)               │
│  ↓                                                   │
│  Database Layer (PostgreSQL / SQLite)               │
│  ↓                                                   │
│  External Services:                                 │
│    • Razorpay (Payment Processor)                   │
│    • TensorFlow LSTM (Neural Predictor)             │
│    • Blockchain Scripts (Hardhat via Subprocess)    │
└─────────────────────────────────────────────────────┘
```

**Framework:** Django 4.2  
**API:** Django REST Framework  
**Database:** PostgreSQL (production) / SQLite (development)  
**Authentication:** JWT + Session-based  
**ML Integration:** TensorFlow/Keras LSTM model  
**Blockchain Sync:** Node.js subprocess calls  

---

## 📁 Directory Topology

```
backend/
├── api/                        # Core application module
│   ├── models.py               # Database schema definitions
│   ├── views.py                # API endpoint logic
│   ├── serializers.py          # JSON transformation layer
│   ├── urls.py                 # Route mapping
│   ├── signals.py              # Automatic blockchain sync triggers
│   ├── admin.py                # Django admin customization
│   ├── apps.py                 # App initialization (startup tasks)
│   ├── auth_views.py           # Login/register/OTP handlers
│   ├── recommendation_view.py  # LSTM prediction endpoint
│   ├── analytics_view.py       # Order statistics + charts
│   └── migrations/             # Database schema versions
│
├── config/                     # Django project settings
│   ├── settings.py             # Environment configuration
│   ├── urls.py                 # Root URL dispatcher
│   └── wsgi.py                 # Production server interface
│
├── media/                      # User-uploaded content
│   ├── products/               # Product images (90+ items)
│   └── profiles/               # User avatars
│
├── management/commands/        # Custom CLI commands
│   └── update_order_statuses.py # Time-based status updater
│
├── manage.py                   # Django CLI entry point
├── seed_data.py                # Populate database with 90 products
├── update_mappings.py          # Sync LSTM indices with DB IDs
├── sync_all_orders_blockchain.py # Bulk blockchain sync script
├── update_orders.bat           # Windows task scheduler helper
└── requirements.txt            # Python dependency list
```

---

## 🗄️ Database Architecture

### Models Overview (The Blueprint of Reality)

**1. User (Django's built-in)**  
The identity anchor. Every action traces back to a user.

**2. UserProfile** 🧑  
Extended user data: phone, address, city, pincode, profile picture, email verification status, Firebase UID.

**3. Category** 📂  
Product groupings: Electronics, Clothing, Medicines, Footwear, Stationery, Baby Care, Sports.

**4. Product** 🏷️  
The merchandise: name, description, price, image, stock, category reference, creation timestamp.

**5. Cart** 🛒  
User's temporary shopping basket (one per user).

**6. CartItem** 📦  
Individual line items: product reference, quantity.

**7. Order** 💳  
Purchase records: user, total amount, status, Razorpay order/payment IDs, creation timestamp.

**Status Lifecycle:**  
`Pending` → `Arriving Tomorrow` → `Delivered` / `Cancelled`

**8. OrderItem** 📋  
Products within an order: product reference, quantity, price snapshot (preserves price at purchase time).

**9. Recommendation** 🤖  
AI-generated suggestions: user, recommended product, confidence score, generation timestamp.

**10. OTPCode** 🔐  
Temporary email verification codes (10-minute validity).

---

## 🔌 API Endpoints: The Command Surface

### Authentication 🔑

**POST** `/api/auth/register/`  
Creates new user account. Returns JWT token.

**POST** `/api/auth/login/`  
Email/password authentication. Returns JWT + user profile.

**POST** `/api/auth/email-login/request/`  
Sends OTP to email (passwordless login).

**POST** `/api/auth/email-login/verify/`  
Validates OTP, returns JWT token.

**GET** `/api/auth/me/`  
Returns current user profile (requires authentication).

---

### Products & Categories 🛍️

**GET** `/api/categories/`  
List all product categories.

**GET** `/api/products/`  
List all products (90+ items across 7 categories).

---

### Shopping Cart 🛒

**GET** `/api/cart/`  
Retrieve user's cart with items.

**POST** `/api/cart/add_item/`  
Add product to cart (or increment quantity if exists).

---

### Orders 💼

**GET** `/api/orders/`  
List user's order history (sorted by creation date).

**POST** `/api/create-razorpay-order/`  
Initiates payment: creates order in DB, generates Razorpay order ID.

**POST** `/api/verify-payment/`  
Validates Razorpay signature, updates order status, clears cart, triggers blockchain sync.

---

### AI Recommendations 🤖

**GET** `/api/user-recommendations/`  
LSTM-powered product suggestions based on purchase history.

---

### Analytics 📊

**GET** `/api/analytics/pulse/`  
Order trajectory data for Pulse Analytics charts (real orders + LSTM predictions).

---

## 🧠 The LSTM Neural Engine

**Purpose:** Predict future purchases based on historical patterns.

**Model Architecture:**
- Input: Sequential purchase data (user-product interactions over time)
- Hidden Layers: LSTM cells (remembers long-term patterns)
- Output: Probability distribution over product catalog

**Training Data:**  
Synthetic purchase sequences generated during seeding (mimics real user behavior).

**Inference Flow:**
1. User accesses `/api/user-recommendations/`
2. Backend queries user's order history
3. LSTM model processes sequence
4. Returns top 5 products with confidence scores
5. Serializer formats as JSON

**Model Files:**
- `lstm_model.h5` (trained weights)
- `product_mappings.json` (maps DB IDs ↔ model indices)

**Maintenance:**
Run `update_mappings.py` after seeding to sync indices.

---

## 💳 Payment Flow: Razorpay Integration

**The Journey of a Transaction:**

1. **User clicks "Checkout"**
   - Frontend calls `/api/create-razorpay-order/`
   - Backend creates `Order` in DB (status: Pending)
   - Razorpay SDK generates order ID
   - Returns order ID + amount to frontend

2. **Frontend opens Razorpay modal**
   - User enters payment details
   - Razorpay processes payment
   - Returns: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`

3. **Frontend sends verification request**
   - Calls `/api/verify-payment/` with signature
   - Backend validates signature using Razorpay secret key
   - If valid:
     - Updates order status → "Arriving Tomorrow"
     - Saves payment ID
     - Clears user's cart
     - **Triggers blockchain sync signal**

4. **Blockchain sync (automatic)**
   - Signal creates order on Ethereum (status: Pending)
   - Updates status to Shipped (1)
   - Returns transaction hash

---

## ⛓️ Blockchain Synchronization Engine

**The Problem:**  
Orders exist in Django. Orders must also exist on blockchain. States must match. Time passes. Status changes. How to keep them aligned?

**The Solution: Signal-Driven Sync**

**File:** `api/signals.py`

**Function:** `sync_order_status_to_ledger()`

**Trigger:** Every time an `Order` is saved.

**Logic:**
1. Check if order is new (`created=True`)
   - If yes: Run `blockchain/scripts/createOrder.js` (creates order on-chain with status 0)
2. Check if status changed to non-Pending
   - Map status: "Arriving Tomorrow" → 1, "Delivered" → 2
   - Run `blockchain/scripts/syncOrder.js` (updates on-chain status)
3. Use `subprocess.run()` (synchronous—waits for blockchain confirmation)
4. Log success/failure

**Result:** Django and blockchain states remain atomic. No drift.

---

## ⏰ Time-Based Status Updater

**The Problem:**  
User orders in June. Closes project. Opens in September. Orders stuck in "Pending."

**The Solution: Automatic Reconciliation**

**File:** `api/management/commands/update_order_statuses.py`

**Execution:**
- Runs automatically on Django startup (via `apps.py`)
- Can be manually triggered: `python manage.py update_order_statuses`

**Logic:**
```python
for order in Orders (exclude: Cancelled, Delivered):
    time_passed = now - order.created_at
    
    if time_passed > 24 hours:
        order.status = 'Delivered'
    elif time_passed > 1 minute:
        order.status = 'Arriving Tomorrow'
    
    order.save()  # Triggers blockchain sync signal
```

**Result:** Orders auto-correct to reflect real-time elapsed since creation. Blockchain syncs catch up.

---

## 🛠️ Key Scripts & Utilities

### `seed_data.py` 🌱
Populates database with:
- 7 categories
- 90+ products (images included)
- Synthetic users (for testing)

**Run once after initial migration.**

---

### `update_mappings.py` 🔄
Syncs LSTM model indices with actual database product IDs.

**Run after seeding or adding new products.**

---

### `sync_all_orders_blockchain.py` ⛓️
Bulk operation: creates and updates all existing orders on blockchain.

**Use case:** Fixing orders created before blockchain sync was implemented.

---

### `update_orders.bat` ⏱️
Windows batch script. Runs `update_order_statuses` command.

**Use case:** Schedule via Windows Task Scheduler (hourly cron equivalent).

---

## 🔐 Security Measures

**Environment Variables:**  
Sensitive data lives in `.env` (never committed to Git):
- Database credentials
- Django secret key
- Razorpay keys
- Blockchain private key (used by scripts, not Django)

**CORS Protection:**  
Configured to allow only frontend origin (localhost:3000 in dev).

**CSRF Tokens:**  
Django's built-in protection for state-changing requests.

**Payment Signature Verification:**  
Razorpay signatures validated server-side (prevents payment spoofing).

**SQL Injection:**  
Django ORM automatically escapes queries.

**Authentication:**  
JWT tokens + session validation. Passwords hashed with Django's PBKDF2 algorithm.

---

## 🚀 Development Commands

**Create database tables:**
```bash
python manage.py migrate
```

**Seed products:**
```bash
python seed_data.py
```

**Sync LSTM mappings:**
```bash
python update_mappings.py
```

**Run development server:**
```bash
python manage.py runserver
# Runs on http://127.0.0.1:8000
```

**Create superuser (admin access):**
```bash
python manage.py createsuperuser
```

**Access admin panel:**
```
http://127.0.0.1:8000/admin/
```

**Update order statuses manually:**
```bash
python manage.py update_order_statuses
```

**Sync all orders to blockchain:**
```bash
python sync_all_orders_blockchain.py
```

---

## 🎯 The Backend's Sacred Duties

**Duty 1: Truth Keeper**  
Every product, every order, every user—stored with integrity. The database is the single source of truth.

**Duty 2: Gateway Guardian**  
All external interactions (payments, AI, blockchain) pass through the backend. It validates, it orchestrates, it protects.

**Duty 3: Time Keeper**  
Orders age. Statuses transition. The backend ensures temporal consistency, even across dormancy.

**Duty 4: Intelligence Broker**  
LSTM models don't talk directly to users. The backend interprets neural outputs into actionable recommendations.

**Duty 5: Blockchain Diplomat**  
Django speaks Python. Ethereum speaks Solidity. The backend bridges languages, ensuring both worlds stay synchronized.

---

## 🔮 Future Enhancements

- **Celery Task Queue:** Offload blockchain syncs to background workers (faster response times)
- **Redis Caching:** Cache product listings, user sessions (reduce DB load)
- **GraphQL Layer:** Alternative to REST (client specifies exact data needs)
- **Webhook Handlers:** Razorpay payment callbacks (asynchronous confirmation)
- **Admin Dashboard:** Custom analytics panel (order volume, revenue, top products)
- **Email Notifications:** Order confirmations, shipping updates
- **Search Optimization:** Elasticsearch for product queries

---

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "The backend is the silent guardian, the watchful          │
│   protector. It doesn't need thanks—only trust."            │
│                                                             │
│                    — The System Architects                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

[← Back to Main Documentation](../README.md)
