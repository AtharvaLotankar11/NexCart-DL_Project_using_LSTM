# 📄 Product Requirements Document (PRD)
# 🛒 NexCart – AI-Powered E-Commerce System using LSTM

---

## 1. 📌 Product Overview

**Product Name:** NexCart  
**Type:** AI-Integrated E-Commerce Web Application  
**Domain:** Deep Learning + Full Stack Development  

NexCart is a simulated e-commerce platform that integrates **Long Short-Term Memory (LSTM)** models to generate **personalized product recommendations** based on user purchase sequences.

The system replicates a real-world e-commerce workflow including:
- Authentication
- Product browsing
- Cart & order lifecycle
- Payment simulation
- Behavioral analytics
- AI-driven recommendation engine
- **Blockchain-secured Order Lifecycle (Smart Ledger)**

---

## 2. 🎯 Problem Statement

Traditional e-commerce platforms rely on:
- Static recommendations
- Generic suggestions
- Non-sequential user modeling

This results in:
- Poor personalization
- Low engagement
- Inefficient product discovery

---

## 3. 💡 Proposed Solution

NexCart introduces a **sequence-aware recommendation system**:

```
User Purchase History → LSTM Model → Next Likely Product Prediction
```

Key idea:
- AI activates **only after meaningful user interaction (≥ 5 past orders)**
- Ensures recommendations are **data-driven, not random**

---

## 4. 👥 Target Users

- General e-commerce users (simulated)
- Academic evaluators (UG project)
- Developers exploring AI + Full Stack integration

---

## 5. 🧭 User Journey & Workflow

---

### 5.1 Entry Barrier (Authentication Required)

User must:
- Register OR
- Login

No access to dashboard without authentication.

---

### 5.2 Registration Workflow

**Inputs:**
- Name
- Email (verification required)
- Password
- Confirm Password
- CAPTCHA

**Excluded:**
- Address / phone (handled later in Profile)

---

### 5.3 Login Workflow

- Email + Password
- Forgot Password (email-based reset)

---

### 5.4 Post-Login Navigation

User enters main dashboard with 4 sections:

1. Home  
2. Products  
3. Your Orders  
4. Profile  

All pages interconnected via:
- Navbar
- Sidebar navigation

---

## 6. 🧱 Functional Requirements

---

## 6.1 Global Layout

### Navbar:
- Logo: NexCart
- User details (name/email/initial/location)

### Sidebar:
- Navigation links to all pages

### Footer:
```
© Atharva Lotankar 2026 – NexCart
```

---

## 6.2 Home Page

### Purpose:
- Introduce platform
- Explain AI uniqueness

### Features:
- About NexCart section
- Explanation of LSTM usage
- Informational blocks (image-text alternating layout)
- Navigation cards:
  - Products
  - Orders
  - Profile

---

## 6.3 Products Page

### Product Domains:
- Clothing
- Shoes
- Electronics
- Generic Medicines (non-prescription)
- Body Care
- Stationery

---

### Product Listing:

Each domain contains:
- Up to 15 products
- Card layout

Each card:
- Image
- Name
- Price

---

### Product Interaction:

**On Click:**
- Card expands (zoom effect)

**Expanded View:**
- Product metadata
- Quantity selector

**Primary Action:**
```
ADD TO CART
```

---

### Post Action Behavior:

- Notification: "Check Your Orders"
- Product added to Orders page (Cart section)

---

## 6.4 Orders Page (Core System Logic)

---

### Initial State:

```
"No products are added or ordered yet"
```

---

### Sections:

---

### A. Add to Cart

- Stores selected products
- Unlimited capacity

Each item:
- Product details
- BUY NOW button

---

### B. Payment Integration

Using Razorpay (Test Mode)

---

#### Payment Success:

```
Cart → Remove Item
Past Orders → Add Item
```

---

#### Payment Failure:

```
Item remains in Cart
```

---

### C. Past Orders

Each order includes:
- Product info
- Order date
- Dynamic status

---

### Real-Time Simulation Logic:

| Time | Status |
|------|--------|
| Immediately | "Arriving Tomorrow" |
| Next Day | "Order Delivered" |

---

### D. Cart ↔ Order Transition

Ensures:
- No duplication
- Proper lifecycle flow
- Clear separation of states

---

## 6.5 AI Recommendation System (LSTM)

---

### Initial State:
- Hidden

---

### Activation Condition:

```
Past Orders ≥ 5
```

---

### Input:

- Sequential purchase data

Example:
```
[Shirt → Shoes → Phone → Charger → Watch]
```

---

### Processing:

- Sequence modeling using LSTM
- Pattern learning

---

### Output:

- Predicted next products
- Must be **previously unvisited items**

---

### UI Behavior:

- "Product Recommender" section becomes visible
- Displays AI recommendations

---

### Key Constraint:

- No recommendations before threshold → avoids noise

---

## 6.6 Blockchain Integration (Smart Ledger)

### Purpose:
- Ensure the journey from **Purchase to Arrival** is tamper-free and secured.
- Provide a transparent, immutable record of order status changes.

### Components:
- **Smart Contract (Solidity):** Manages the order state on the blockchain.
- **Wallet Integration (Metamask):** Allows users to sign/verify transitions or view decentralized records.
- **Decentralized Ledger:** Stores hashes of order transitions.

### Blockchain Workflow:
1. **Order Initiation:** When a user pays via Razorpay, a record is simultaneously requested for the Smart Ledger.
2. **Status Updates:** Each transition (Order Placed → Shipped → Arrived) is recorded as a transaction on the blockchain.
3. **Tamper-Free Verification:** User can verify their order's journey via the dApp interface integrated into the Orders page.

---

## 6.7 Profile Page

---

### User Information:

- Name
- Email (verification status)
- Phone number
- Address
- Profile picture upload

---

### Analytics Section:

#### 1. Transaction Analysis
- Time-series graph of purchases

#### 2. Optimized Product Insights
- Category distribution
- Buying behavior visualization

---

### Account Controls:

#### Logout:
- Redirect to login page

---

#### Delete Account:

Flow:
```
Click Delete → Confirmation Dialog → Final Confirmation
```

Outcome:
- Permanent deletion from database

---

## 7. 🧠 Non-Functional Requirements

---

### Performance:
- Fast page loading
- Efficient API responses

---

### Scalability:
- Modular backend (Django APIs)
- Separate ML service possible

---

### Security:
- Authentication required
- Email verification
- CAPTCHA protection

---

### Usability:
- Clean UI
- Intuitive navigation
- Realistic flow simulation

---

## 8. 🧪 Tech Stack

---

### Frontend:
- Next.js

---

### Backend:
- Django REST Framework

---

### Database:
- PostgreSQL

---

### AI/ML:
- Python
- TensorFlow / PyTorch

---

### Integrations:
- Razorpay API
- Firebase (Phone Auth)
- Nodemailer (Email services)

---

## 9. 🔌 API Requirements (High-Level)

---

### Authentication:
- POST /register
- POST /login

---

### Products:
- GET /products
- GET /product/{id}

---

### Orders:
- POST /cart/add
- POST /order/checkout
- GET /orders

---

### AI:
- GET /recommendations/{user_id}

---

## 10. 📊 Success Metrics

- Recommendation accuracy
- User interaction depth (simulated)
- System responsiveness
- Completion of full workflow

---

## 11. ⚠️ Constraints & Assumptions

---

### Constraints:
- Limited dataset (mini project scale)
- Simulated real-time delivery logic
- Test-mode payment gateway

---

### Assumptions:
- Users behave realistically
- Sequential data is sufficient for LSTM learning
- Product dataset is representative

---

## 12. 📌 Conclusion

NexCart is a **complete AI-integrated system** that:

- Simulates real-world e-commerce behavior
- Demonstrates practical Deep Learning application
- Bridges frontend, backend, and ML seamlessly

It stands as a **comprehensive engineering project** combining:
- System design
- Machine learning
- Application development

---
