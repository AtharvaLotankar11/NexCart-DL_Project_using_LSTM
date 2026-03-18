# 📋 NexCart – Comprehensive Project Todo List

This todo list integrates all requirements and design specifications from the PRD, Design, and Tech Stack documents into actionable, sequential steps.

---

## 🛠️ Phase 1: Project Setup & Repository Initialization
*Goal: Setup the skeleton for the entire monolithic/modular project.*

- [x] Initialize Git repository
- [x] Create overarching project directory structure `nexcart/`
  - [x] Create `frontend/` directory
  - [x] Create `backend/` directory
  - [x] Create `ml-model/` directory
  - [x] Create `docs/` directory and move PRD, Design, and Tech Stack documents there

---

## 🗄️ Phase 2: Database & Backend Setup
*Goal: Setup Django APIs and PostgreSQL database.*

- [x] Initialize Django project and app in `backend/` directory
- [x] Install and configure Django REST Framework
- [x] Provision and connect PostgreSQL database
- [x] Create Database Models/Tables:
  - [x] `Users` (Link with Firebase Auth profile if necessary)
  - [x] `Products` & `Categories`
  - [x] `Cart Items`
  - [x] `Orders` & `Order History`
  - [x] `Recommendations` (Optional caching table)
- [x] Run initial database migrations
- [x] Setup basic JSON-based REST API routing

---

## 🖥️ Phase 3: Frontend Setup & Global UI
*Goal: Initialize Next.js and build the persistent layout.*

- [x] Initialize Next.js project in `frontend/` directory
- [x] Install and configure Tailwind CSS (or alternative styling library)
- [x] Configure global design tokens (Inter/Poppins fonts, Off-white/Beige backgrounds, Charcoal text)
- [x] Build Global Layout Components:
  - [x] **Navbar:** Sticky top, Logo (NexCart), user details (name/email/initial/location)
  - [x] **Sidebar:** Fixed position, Icon + label, links to all pages, collapsible on mobile
  - [x] **Footer:** "© Atharva Lotankar 2026 – NexCart"
- [x] Set up layout routing so Navbar/Sidebar persist across dashboard pages

---

## 🔐 Phase 4: Authentication & User Management
*Goal: Secure the application and restrict access.*

- [x] Integrate Firebase Authentication for Phone Number Verification (OTP)
- [x] Setup Nodemailer for Email Services
- [x] Build the **Registration Workflow**:
  - [x] Create form with: Name, Email, Password, Confirm Password, CAPTCHA
  - [x] Implement email verification via Nodemailer
- [x] Build the **Login Workflow**:
  - [x] Create form for Email + Password
  - [x] Implement Forgot Password flow (email-based reset)
- [x] Implement protected routing mechanism (No access to dashboard sections without authentication)
- [x] Create Auth API endpoints (`POST /register`, `POST /login`)

---

## 🏠 Phase 5: Home Page Design & Implementation
*Goal: Build the landing experience and highlight platform features.*

- [x] Build **Hero Section** (Left: Text, Right: Visual):
  - [x] Title: "NexCart – Smarter Shopping with AI"
  - [x] Subtitle: "LSTM-based personalization"
  - [x] Primary CTA: "Explore Products"
  - [x] Implement Hero motion: Product floating/rotating animation, text fade-in
- [x] Build **Feature Highlight Section**:
  - [x] Alternating image/text grid highlighting: AI Recommendations, Smart Order Tracking, Real-time Experience
- [x] Build **Navigation Cards Section**:
  - [x] 3 Cards: Explore Products, Your Orders, Profile
  - [x] Implement hover lift effect and routing upon click
- [x] Add global scroll animations (elements fade in, slide from sides)

---

## 🛍️ Phase 6: Product Browsing & Selection
*Goal: Allow users to view and interact with products.*

- [x] Implement Product API endpoints in Django (`GET /api/products`, `GET /api/categories`)
- [x] Build **Products Page**:
  - [x] Setup sections by domain (Clothing, Shoes, Electronics, Medicines, Body Care, Stationery)
  - [x] Build Product Cards (Rounded corners, soft shadow, minimal text: Image, Name, Price)
  - [x] Add hover interactions (Slight zoom, shadow increase)
- [x] Create **Product Detail View**:
  - [x] Implement smooth modal opening
  - [x] "Add to Cart" integration inside details
  - [x] Zoomable product image
  - [x] Add Quantity Selector
- [x] Implement **Global Cart Context**:
  - [x] Persistent cart state (Local Storage)
  - [x] Navbar count badge update
- [x] Setup API integration for persistent cart syncing (`POST /api/cart/add_item`)

---

## 💳 Phase 7: Order Management & Payment Integration
*Goal: Manage the cart lifecycle, simulate delivery, and handle payments.*

- [ ] Build **Cart Page** (`/cart`):
  - [ ] List all items with adjustable quantities
  - [ ] Real-time total calculation with tax/shipping simulation
  - [ ] "Checkout Now" primary action
- [ ] Implement **Checkout Flow**:
  - [ ] Shipping Address form (Beautiful multi-step or single-page)
  - [ ] Order summary confirmation
- [ ] **Payment Integration**:
  - [ ] Simulate Razorpay/Stripe UI modal
  - [ ] Success/Failure state handling
- [ ] **Post-Purchase**:
  - [ ] Redirect to "Your Orders" with dynamic status ("Pending" -> "Arriving Tomorrow")
- [ ] Implement Backend Order APIs:
  - [ ] `POST /api/orders/create` (Convert Cart to Order)
  - [ ] `GET /api/orders` (Fetch History)
- [ ] Build **Orders History Page**:
  - [ ] List ordered items with order date
  - [ ] Implement simulated status timeline badges ("Arriving Tomorrow", "Delivered")

---

## 🤖 Phase 8: AI / LSTM Recommendation Engine
*Goal: Integrate the core Deep Learning recommender system.*

- [ ] Setup Python ML environment (TensorFlow/Keras/PyTorch, Pandas, NumPy, Scikit-learn)
- [ ] Preprocess sequential purchase data
- [ ] Build sequence encoding pipeline
- [ ] Train the LSTM Model to predict subsequent product choices
- [ ] Wrap Model in an API or Microservice (FastAPI/Flask or Django View) (`GET /recommendations/{user_id}`)
- [ ] Integrate Recommender into Frontend (Orders Page Hero Section):
  - [ ] **Condition:** Reveal section ONLY IF Past Orders >= 5
  - [ ] Filter logic: Recommendations must be previously unvisited items
  - [ ] UI: Horizontal scroll cards with alternate background, "Recommended for You" tag
  - [ ] Animation: Slide-in reveal, cards animate sequentially

---

## 👤 Phase 9: Profile Page & Analytics
*Goal: Allow users to manage their account and view personal insights.*

- [ ] Build **Profile Page – User Info Section** (Two-column layout):
  - [ ] Profile picture upload functionality
  - [ ] Form fields: Name, Email (verified status), Phone, Address
- [ ] Implement Analytics Section (Integrate Chart.js / Recharts):
  - [ ] Transaction Analysis: Time-series graph / Line chart of purchases
  - [ ] Optimized Product Insights: Bar / Pie chart mapping category distribution
- [ ] Build **Account Controls Section**:
  - [ ] Add Logout button (Redirects to login)
  - [ ] Add Delete Account button 
  - [ ] Build 2-step confirmation modal for permanent account deletion

---

## 🧪 Phase 10: Polish & Deployment
*Goal: Finalize styling, responsiveness, and go live.*

- [ ] Test Mobile Responsiveness (Foldable sidebar, stacked product grids)
- [ ] Complete UI Polish (Ensure smooth micro-interactions, button ripples, adequate white space)
- [ ] Perform E2E tests simulating the required logic flow: User register -> adds 5 past orders -> sees AI Recommendations
- [ ] Configure and deploy Frontend to Vercel
- [ ] Configure and deploy Backend API / ML API (Render / Railway / AWS)
- [ ] Migrate database to production hosting (Supabase / Neon)
