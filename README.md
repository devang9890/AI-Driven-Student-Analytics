# RiskSense – Education Analytics

**AI-Powered Student Risk Prediction & Academic Analytics Platform**

RiskSense is an end-to-end AI-based web platform designed to identify, monitor, and predict academic risk among students using behavioral, attendance, and performance data.

The system helps institutions proactively detect students who may struggle academically and provides insights through dashboards, analytics, and alerts.

---

## 🚀 Project Overview

RiskSense is a full-stack AI analytics system built using:

- **FastAPI** (backend APIs)
- **React + Tailwind** (frontend dashboards)
- **MongoDB** (student data storage)
- **Machine Learning** (risk prediction)
- **Excel ingestion** (bulk data entry)
- **Admin analytics portal**

It provides:

✔ Student risk prediction  
✔ Subject-wise performance tracking  
✔ Attendance monitoring  
✔ Behaviour analysis  
✔ Alerts system  
✔ Manual and Excel data entry  
✔ Admin analytics dashboard  

---

## 🧠 Problem Statement

Educational institutions struggle to:

- Identify academically weak students early
- Track risk trends over time
- Analyze performance across subjects
- Use data for proactive intervention

**RiskSense solves this using AI.**

---

## 🧩 System Architecture

### 🔹 Frontend

**React + Tailwind Admin Analytics Portal**

Modules:

- Login
- Admin Dashboard
- Student Management
- Manual Entry
- Excel Upload
- Alerts
- Analytics Portal

### 🔹 Backend

**FastAPI REST APIs**

Handles:

- Student CRUD operations
- Prediction engine
- Alerts
- Data ingestion
- ML integration

### 🔹 Database

**MongoDB**

Stores:

- student data
- subject marks
- attendance
- behaviour
- predictions
- alerts

### 🔹 Machine Learning Layer

**Random Forest model** trained on:

- attendance
- marks
- behaviour
- academic patterns

Outputs:

- predicted risk level
- confidence score

---

## 📸 Screenshots

### Login Portal
![Login Page](screenshots/login.png)
*Secure admin authentication with JWT tokens*

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)
*Real-time student risk metrics and alert management*

### Analytics Portal
![Analytics Portal](screenshots/analytics.png)
*Comprehensive dashboards with risk distribution and performance trends*

---

## ⚙️ Features Explained

### 🔐 Admin Login System

- Admin-only authentication
- JWT-based session
- Protected routes
- Dashboard access

### 👨‍🎓 Student Risk Prediction

Risk is calculated using:

- attendance %
- average marks
- behaviour score

Model predicts:

- **LOW RISK**
- **MEDIUM RISK**
- **HIGH RISK**

Also outputs:

- Confidence Score (%)

### 📊 Analytics Dashboard

Displays:

- Risk badges
- Attendance stats
- Average marks
- Behaviour score
- Subject-wise charts
- Risk probability gauge
- Alerts panel

### 🧾 Manual Student Entry

Admin can:

- add student
- enter subject-wise marks
- edit subjects
- delete subjects
- system auto-calculates average marks

### 📁 Excel Upload

Admin uploads:

- .xlsx / .csv files

System:

- parses file
- stores data
- calculates averages
- runs prediction
- generates alerts

### 🚨 Alerts System

Triggers when:

- attendance low
- marks drop
- behaviour issues
- high risk detected

Alerts appear in:

- admin dashboard
- analytics portal

### 🧠 Machine Learning Workflow

1. Dataset created
2. Features extracted
3. Model trained
4. Model saved (.pkl)
5. Loaded into API
6. Used for real-time predictions

---

## 🛠 Tech Stack

### 🧩 Backend

**FastAPI**
- REST API framework
- async processing
- high performance

**PyMongo**
- MongoDB integration

**Pydantic**
- request validation
- schema management

### 🤖 Machine Learning

**scikit-learn**
- Used for: model training, prediction, classification
- Algorithm: RandomForestClassifier
- Why? handles non-linear data, robust, accurate for classification

**pandas**
- Used for: dataset processing, Excel parsing, feature engineering

**numpy**
- Used for: numerical operations, ML inputs

**joblib**
- Used for: saving trained ML model, loading model in production

### 🎨 Frontend

**React**
- UI components
- routing
- dashboard structure

**Tailwind CSS**
- styling
- responsive UI
- modern layout

**Axios**
- API communication

**Recharts**
- performance graphs
- subject charts
- risk visualizations

---

## 📂 Project Structure

```
backend/
│
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── schemas/
│   ├── ml/
│   │   ├── train_model.py
│   │   ├── predictor.py
│   │   ├── risk_model.pkl
│   │
│   ├── database.py
│   └── config.py
│
frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── layout/
│   ├── analytics/
│   ├── admin/
```

---

## 🧠 How ML Prediction Works

**Input:**

- attendance
- subject marks
- behaviour

**System:**

```
avg_marks = mean(subject marks)
```

**Model predicts:**

- risk_level
- confidence_score

**Output** shown on dashboard.

---

## 📈 Risk Levels Logic

| Level | Meaning |
|-------|---------|
| LOW | Student performing well |
| MEDIUM | Needs monitoring |
| HIGH | Needs intervention |

**Confidence Score:** Model certainty level.

---

## 💡 Real-World Use Case

Schools / Colleges can:

- identify weak students early
- intervene before failure
- monitor academic health
- improve pass rates

---

## 🏆 Key Achievements

- Full-stack AI system
- ML integrated with web
- real-time predictions
- admin analytics portal
- Excel ingestion pipeline
- subject-level analytics
- alerts automation

---

## 📊 Resume Description

Built **RiskSense – Education Analytics**, an AI-powered academic risk prediction platform using FastAPI, React, MongoDB, and Machine Learning that analyzes student attendance, subject performance, and behavior to generate real-time risk insights and alerts.

---

## 🎯 Future Enhancements

- semester comparison
- dropout prediction
- teacher analytics
- parent portal
- mobile app
- real-time notifications
- ML retraining dashboard

---

## 👨‍💻 Author

**Developed by:** Devang Singh  
**Tech Stack:** MERN + FastAPI + ML

---

## ⭐ Final Summary

**RiskSense is not just a project.**

It is a:

- product
- research system
- analytics platform
- ML application
- full-stack solution

It demonstrates:

✔ AI integration  
✔ real-world problem solving  
✔ full-stack engineering  
✔ data pipeline design  
✔ dashboard analytics  

---

## 🚀 Getting Started

### 1) Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3) Login (Default Dev Credentials)

- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---

## 📝 Environment Variables (Backend)

Create a `.env` (optional) or export variables before running:

- `MONGO_URL` (default: `mongodb://localhost:27017`)
- `MONGO_DB` (default: `student_risk`)
- `JWT_SECRET` (default: `CHANGE_ME_SUPER_SECRET`)
- `JWT_EXPIRE_HOURS` (default: `8`)

---

**Built for early intervention and measurable student success.**