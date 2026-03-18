# 📋 NexCart – Comprehensive Project Todo List

This todo list integrates all requirements and design specifications from the PRD, Design, and Tech Stack documents into actionable, sequential steps.

---

## 🛠️ Phase 1: Project Setup & Repository Initialization
*Goal: Setup the skeleton for the entire monolithic/modular project.*

- [ ] Initialize Git repository
- [ ] Create overarching project directory structure `nexcart/`
  - [ ] Create `frontend/` directory
  - [ ] Create `backend/` directory
  - [ ] Create `ml-model/` directory
  - [ ] Create `docs/` directory and move PRD, Design, and Tech Stack documents there

---

## 🗄️ Phase 2: Database & Backend Setup
*Goal: Setup Django APIs and PostgreSQL database.*

- [ ] Initialize Django project and app in `backend/` directory
- [ ] Install and configure Django REST Framework
- [ ] Provision and connect PostgreSQL database
- [ ] Create Database Models/Tables:
  - [ ] `Users` (Link with Firebase Auth profile if necessary)
  - [ ] `Products` & `Categories`
  - [ ] `Cart Items`
  - [ ] `Orders` & `Order History`
  - [ ] `Recommendations` (Optional caching table)
- [ ] Run initial database migrations
- [ ] Setup basic JSON-based REST API routing

---

## 🖥️ Phase 3: Frontend Setup & Global UI
*Goal: Initialize Next.js and build the persistent layout.*

- [ ] Initialize Next.js project in `frontend/` directory
- [ ] Install and configure Tailwind CSS (or alternative styling library)
- [ ] Configure global design tokens (Inter/Poppins fonts, Off-white/Beige backgrounds, Charcoal text)
- [ ] Build Global Layout Components:
  - [ ] **Navbar:** Sticky top, Logo (NexCart), user details (name/email/initial/location)
  - [ ] **Sidebar:** Fixed position, Icon + label, links to all pages, collapsible on mobile
  - [ ] **Footer:** "© Atharva Lotankar 2026 – NexCart"
- [ ] Set up layout routing so Navbar/Sidebar persist across dashboard pages

---

## 🔐 Phase 4: Authentication & User Management
*Goal: Secure the application and restrict access.*

- [ ] Integrate Firebase Authentication for Phone Number Verification (OTP)
- [ ] Setup Nodemailer for Email Services
- [ ] Build the **Registration Workflow**:
  - [ ] Create form with: Name, Email, Password, Confirm Password, CAPTCHA
  - [ ] Implement email verification via Nodemailer
- [ ] Build the **Login Workflow**:
  - [ ] Create form for Email + Password
  - [ ] Implement Forgot Password flow (email-based reset)
- [ ] Implement protected routing mechanism (No access to dashboard sections without authentication)
- [ ] Create Auth API endpoints (`POST /register`, `POST /login`)

---

## 🏠 Phase 5: Home Page Design & Implementation
*Goal: Build the landing experience and highlight platform features.*

- [ ] Build **Hero Section** (Left: Text, Right: Visual):
  - [ ] Title: "NexCart – Smarter Shopping with AI"
  - [ ] Subtitle: "LSTM-based personalization"
  - [ ] Primary CTA: "Explore Products"
  - [ ] Implement Hero motion: Product floating/rotating animation, text fade-in
- [ ] Build **Feature Highlight Section**:
  - [ ] Alternating image/text grid highlighting: AI Recommendations, Smart Order Tracking, Real-time Experience
- [ ] Build **Navigation Cards Section**:
  - [ ] 3 Cards: Explore Products, Your Orders, Profile
  - [ ] Implement hover lift effect and routing upon click
- [ ] Add global scroll animations (elements fade in, slide from sides)

---

## 🛍️ Phase 6: Product Browsing & Selection
*Goal: Allow users to view and interact with products.*

- [ ] Implement Product API endpoints in Django (`GET /products`, `GET /product/{id}`)
- [ ] Build **Products Page**:
  - [ ] Setup sections by domain (Clothing, Shoes, Electronics, Medicines, Body Care, Stationery)
  - [ ] Build Product Cards (Rounded corners, soft shadow, minimal text: Image, Name, Price)
  - [ ] Add hover interactions (Slight zoom, shadow increase)
- [ ] Build **Product Detail View**:
  - [ ] Build expanded view (Modal or full page) with large image, metadata, price
  - [ ] Add Quantity Selector
  - [ ] Add **ADD TO CART** primary button
  - [ ] Add smooth zoom-in animation from the card
- [ ] Setup Add to Cart frontend logic (Notification: "Check Your Orders")
- [ ] Include API integration for adding items to the cart (`POST /cart/add`)

---

## 💳 Phase 7: Order Management & Payment Integration
*Goal: Manage the cart lifecycle, simulate delivery, and handle payments.*

- [ ] Build **Orders Page – Add to Cart Section**:
  - [ ] Vertical stacked cards for selected items
  - [ ] Card contents: Image, Name, Price, "BUY NOW" button
- [ ] Integrate Razorpay (Test Mode) API for checkout (`POST /order/checkout`)
- [ ] Implement Payment Flow Logic:
  - [ ] Logic for Success: Remove from Cart → Add to Past Orders
  - [ ] Logic for Failure: Item remains in Cart
- [ ] Build **Orders Page – Past Orders Section**:
  - [ ] List ordered items with order date
  - [ ] Implement simulated status timeline badges ("Arriving Tomorrow", "Delivered")
  - [ ] Add fade transition for status changes
- [ ] Build Orders API to fetch user's history (`GET /orders`)

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
