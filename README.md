# NexCart: AI-Driven Sequential Recommendation System 🛒🧠

NexCart is a high-fidelity, full-stack E-Commerce platform that utilizes **Deep Learning (Stacked LSTM)** to predict and curate personalized shopping experiences. It integrates professional logistics management, secure localized payments, and real-time behavioral telemetry.

---

## 🛠️ The Architecture Hub

- **Frontend**: Next.js 16 (Turbopack) + TailwindCSS + Recharts
- **Backend API**: Django Rest Framework + PostgreSQL
- **AI/ML Logic**: TensorFlow Keras Stacked LSTM
- **Identity Pulse**: JWT Authentication with secure Cookie persistence
- **Financial Gateway**: Razorpay Integration (Localized)

---

## 🚀 Local Deployment Pulse

### 1. Prerequisites
- **Python 3.10+** & **Node.js 18+**
- **PostgreSQL** instance named `nexcart_db`

### 2. Backend Orchestration
Configure your `.env` in the `backend/` directory:
```bash
SECRET_KEY=your_secret
DB_NAME=nexcart_db
DB_USER=postgres
DB_PASSWORD=your_password
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
RECAPTCHA_SECRET_KEY=your_key
```

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Pulse
Configure your `.env.local` in the `frontend/` directory:
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_id
```

```bash
cd frontend
npm install
npm run dev
```

### 4. Neural Engine Activation
To train the LSTM model on synthetic shopping sequences:
```bash
cd ml-model
python generate_synthetic_data.py
python preprocess_and_train.py
```

---

## 🤖 AI Logic Workflow

1. **Behavioral Tracking**: Every purchase is logged as a "Semantic Pulse" in the interaction grid.
2. **Sequential Encoding**: Once a user reaches **5 past orders**, the system extracts their last 10 product interactions.
3. **Inference**: The Stacked LSTM model predicts the next 5 likely candidates from previously unvisited inventory.
4. **Predictive Curation**: The results are surfaced on the **Orders Dashboard** with high-fidelity Glassmorphic cards.

---

## 📊 Analytics & Insights
Visit the **Profile Hub** to view your **Behavioral Telemetry**:
- **Spending Timeline**: Real-time expenditures via Recharts Line Chart.
- **Category Matrix**: User preference distribution via Pie Chart.

---

## 🛡️ License
NexCart Intelligence is an open-research project for localized AI-commerce.
