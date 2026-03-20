# 🧰 NexCart – Tech Stack Documentation

---

## 📌 1. Overview

NexCart is a **full-stack AI-integrated web application** combining:

- Modern frontend framework
- Scalable backend APIs
- Relational database
- Deep Learning model (LSTM)
- Blockchain Integration (Solidity)
- External service integrations

The stack is chosen to ensure:
- Modularity
- AI-IDE compatibility
- Real-world architecture simulation

---

## 🎨 2. Frontend Layer

### ⚙️ Framework: Next.js

**Why Next.js?**
- Server-side rendering (SSR)
- Fast routing
- SEO-friendly
- Industry standard for React apps

---

### 🎨 Styling Options:
- Tailwind CSS *(recommended for speed)*
- OR Bootstrap *(if simplicity preferred)*

---

### 🧩 UI Components:

- Navbar (global)
- Sidebar navigation
- Product cards
- Expanded product modal
- Graph components (charts)
- Notifications / Toasts

---

### 📊 Visualization:
- Chart.js OR Recharts

Used in:
- Transaction Analysis
- Product Insights

---

## 🔧 3. Backend Layer

### ⚙️ Framework: Django + Django REST Framework

**Why Django?**
- Rapid development
- Built-in admin panel
- Strong ORM
- Easy API integration

---

### 🔌 API Responsibilities:

- Authentication APIs
- Product APIs
- Cart & Order APIs
- Payment handling
- AI recommendation endpoint

---

## 🗄️ 4. Database Layer

### 🐘 PostgreSQL

**Why PostgreSQL?**
- Relational integrity
- Complex queries support
- Production-grade reliability

---

### 📦 Core Tables:

- Users
- Products
- Categories
- Cart Items
- Orders
- Order History
- Recommendations (optional caching)

---

## 🤖 5. AI / Machine Learning Layer

---

### 🧠 Model: LSTM (Long Short-Term Memory)

**Purpose:**
- Sequence-based recommendation

---

### 📚 Libraries:

- TensorFlow / Keras *(recommended)*
- OR PyTorch

---

### 📊 Data Tools:

- Pandas
- NumPy
- Scikit-learn (preprocessing)

---

### 🔁 ML Pipeline:

```
Raw Order Data
   ↓
Sequence Encoding
   ↓
LSTM Training
   ↓
Model Saving (.h5 / .pt)
   ↓
Prediction API
```

---

### ⚙️ Serving Strategy:

Option 1:
- Direct integration in Django

Option 2 (Recommended):
- Separate microservice (FastAPI / Flask)

---

## ⚙️ 6. Blockchain Layer (Smart Ledger)

### ⛓️ Language: Solidity

**Purpose:**
- Developing Smart Contracts for order status management.

---

### 🦊 Crypto Wallet: MetaMask

**Used for:**
- User identity on the blockchain.
- Signing transactions for order verification.

---

### 🌉 Library: Ethers.js OR Web3.js

**Used for:**
- Bridging frontend (Next.js) with the Ethereum network.

---

### 🏢 Local Network: Hardhat OR Ganache

**Used for:**
- Deploying and testing smart contracts in a local environment.

---

## 💳 7. Payment Integration

### Razorpay API (Test Mode)

**Used for:**
- Simulating real payment workflow

---

### Flow:

```
BUY NOW → Razorpay → Success/Failure Callback
```

---

## 🔐 7. Authentication & Security

---

### Firebase Authentication:

- Phone number verification (OTP)

---

### Nodemailer:

- Email verification
- Password reset

---

### CAPTCHA:

- Prevent bot registrations

---

## 📡 8. API Communication

### Format:
- JSON-based REST APIs

---

### Example:

```
GET /api/products
POST /api/cart/add
GET /api/recommendations/{user_id}
```

---

## 🧪 9. Development Tools

---

### IDE:
- VS Code / Cursor (AI IDE)

---

### Version Control:
- Git + GitHub

---

### API Testing:
- Postman

---

### Package Managers:
- npm / yarn (frontend)
- pip (backend)

---

## 📂 10. Project Structure

```
nexcart/
│
├── frontend/        # Next.js app
├── backend/         # Django APIs
├── ml-model/        # LSTM model
├── docs/            # PRD, SRS, etc.
└── README.md
```

---

## ⚙️ 11. Deployment (Optional)

---

### Frontend:
- Vercel

### Backend:
- Render / Railway / AWS

### Database:
- PostgreSQL Cloud (Supabase / Neon)

---

## 📌 12. Design Philosophy

- Modular architecture
- Clear separation of concerns
- AI as a feature, not a dependency
- Real-world simulation over shortcuts

---

## 🧾 13. Summary

The NexCart tech stack is designed to:

- Reflect real industry systems
- Support AI integration cleanly
- Enable fast development with scalability

---
