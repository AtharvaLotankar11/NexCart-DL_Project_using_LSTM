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

- [x] Build **Cart Page** (`/cart`):
  - [x] List all items with adjustable quantities
  - [x] Real-time total calculation with tax/shipping simulation
  - [x] "Checkout Now" primary action
- [x] Implement **Checkout Flow**:
  - [x] Shipping Address form (Beautiful multi-step or single-page)
  - [x] Order summary confirmation
- [x] **Payment Integration**:
  - [x] Simulate Razorpay/Stripe UI modal
  - [x] Success/Failure state handling
- [x] **Post-Purchase**:
  - [x] Redirect to "Your Orders" with dynamic status ("Pending" -> "Arriving Tomorrow")
- [x] Implement Backend Order APIs:
  - [x] `POST /api/create-order/` (Convert Cart to Order)
  - [x] `POST /api/verify-payment/` (Confirm payment and clear cart)
  - [x] `POST /api/track-interaction/` (Log activity for LSTM training)
  - [x] `GET /api/orders` (Fetch History)
- [x] Build **Orders History Page**:
  - [x] List ordered items with order date
  - [x] Implement simulated status timeline badges ("Arriving Tomorrow", "Delivered")

---

## 🤖 Phase 8: AI / LSTM Recommendation Engine
*Goal: Integrate the core Deep Learning recommender system.*

- [x] Setup Python ML environment (TensorFlow/Keras/PyTorch, Pandas, NumPy, Scikit-learn)
- [x] Preprocess sequential purchase data
- [x] Build sequence encoding pipeline
- [x] Train the LSTM Model to predict subsequent product choices
- [x] Wrap Model in an API or Microservice (FastAPI/Flask or Django View) (`GET /recommendations/{user_id}`)
- [x] Integrate Recommender into Frontend (Orders Page Hero Section):
  - [x] **Condition:** Reveal section ONLY IF Past Orders >= 5
  - [x] Filter logic: Recommendations must be previously unvisited items
  - [x] UI: Horizontal scroll cards with alternate background, "Recommended for You" tag
  - [x] Animation: Slide-in reveal, cards animate sequentially

---

## 👤 Phase 9: Profile Page & Analytics
*Goal: Allow users to manage their account and view personal insights.*

- [x] Build **Profile Page – User Info Section** (Two-column layout):
  - [x] Profile picture upload functionality
  - [x] Form fields: Name, Email (verified status), Phone, Address
- [x] Implement Analytics Section (Integrate Chart.js / Recharts):
  - [x] Transaction Analysis: Time-series graph / Line chart of purchases
  - [x] Optimized Product Insights: Bar / Pie chart mapping category distribution
- [x] Build **Account Controls Section**:
  - [x] Add Logout button (Redirects to login)
  - [x] Add Delete Account button 
  - [x] Build 2-step confirmation modal for permanent account deletion

---

## 🏁 Phase 10: Local System Calibration & GitHub Sync
*Goal: Stress test the full AI-Commerce lifecycle and polish the local experience.*

- [x] **Technical Documentation & Cleanup**:
  - [x] Create/Update **README.md** with "Local Deployment" instructions
  - [x] Sanitize **.env.example** placeholders for secure GitHub staging
- [x] **High-Fidelity UI/UX Polish**:
  - [x] Test **Mobile Responsiveness** (Verified foldable sidebar & grids)
  - [x] Complete UI Polish (Applied **framer-motion** sequential animations)
- [x] **Zero-to-Intelligence Walkthrough**:
  - [x] Execute E2E Simulation: New User -> 5 AI Interaction Pulses -> LSTM Hero Activation
  - [x] Verify Analytics Telemetry (Synchronized spend timeline & category matrix)
- [x] **GitHub Repository Sync**:
  - [x] Commit all finalized Phase 1-9 assets to source control
  - [x] Handover: The "Closing High-Fidelity Pulse"

---

## ⛓️ Phase 11: Blockchain Integration & Secure Supply Chain (Upcoming)
*Goal: Implement a decentralized ledger for tamper-free order tracking.*

- [x] **Blockchain Environment Setup**:
  - [x] Initialize Hardhat/Truffle project in root or new `blockchain/` directory
  - [x] Configure local test network (Hardhat Network / Ganache)
  - [x] Install `ethers.js` or `web3.js` in frontend
- [x] **Smart Contract Development (Solidity)**:
  - [x] Design and write `OrderLedger.sol` contract
  - [x] Implement state variables for Order Hash and Status (Pending, Shipped, Arrived)
  - [x] Create functions for creating orders and updating status with owner/authorised person only access
  - [x] Add event emitters for frontend reactivity
- [x] **Metamask Integration**:
  - [x] Implement "Connect Wallet" functionality in frontend Profile/Orders page
  - [x] Setup wallet state persistence and network checking (Ethereum/Polygon testnets)
- [x] **Smart Contract Deployment**:
  - [x] Deploy contract to local testnet and capture ABI/Address
  - [x] (Future) Deploy to testnets like Goerli, Sepolia or Polygon Amoy
- [x] **End-to-End Secure Workflow**:
  - [x] Trigger blockchain transaction upon successful Razorpay payment
  - [x] Update order status on-chain when the backend simulates status transitions
  - [x] Build "Verify on Blockchain" UI component in Past Orders to fetch and display immutable status from the contract
- [x] **Security Evaluation**:
  - [x] Audit contract for common vulnerabilities (Reentrancy, etc.)
  - [x] Ensure only the authorized "Store Admin" (simulated) can push status updates 

---
