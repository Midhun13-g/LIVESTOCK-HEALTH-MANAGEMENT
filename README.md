
## 🚀 Features

### 🐄 Animal Management
- Add, edit, and remove animals with full profile (species, breed, DOB, weight, status)
- Smart checkup status classification — **Overdue / Today / Upcoming / Scheduled / Future**
- Color-coded health badges — Healthy / Treatment / Critical
- Search, filter, and sort animals by species, status, and checkup date

### 📊 Analytics & Reports
- Interactive dashboard with live KPI cards — total animals, health score, overdue count
- Charts — Health distribution (doughnut), species breakdown (bar), avg weight by species
- Checkup status breakdown with clickable filter bars
- Dynamic filter slicers — species, health status, checkup status, date range, urgent-only toggle
- Active filter chips with one-click removal

### 🔬 Disease Prediction
- ML-powered disease prediction using animal type, age, temperature, and symptoms
- Top 3 predicted diseases with confidence scores
- Explainable AI — shows which features contributed most to the prediction
- Auto-notification when high-confidence prediction is made

### 📖 Disease Guide
- 23 livestock diseases across Cattle, Pigs, Sheep, Goats, Poultry, Horses
- Each disease includes — symptoms, transmission, mortality rate, treatment, prevention, zoonotic risk
- Filter by species, risk level, and search by symptom or disease name

### 🔔 Notifications
- Real-time polling every 30 seconds
- Live unread badge on the bell icon
- Auto-notifications for — critical status changes, overdue checkups, disease predictions
- Daily scheduled alerts — overdue, today, and upcoming checkups via background scheduler
- Mark as read, mark all, delete

### ⚙️ Settings
- Persistent settings saved to localStorage
- Controls — default sort/filter for Animals page, Dashboard filter, refetch on focus
- Toggle report sections — health pie, species chart, checkup table
- Date format preference (en-IN / en-US / en-GB)

### 👤 Authentication
- JWT-based login and registration
- Auto logout on token expiry
- Protected routes

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Chart.js, Lucide Icons    |
| Backend   | FastAPI, Python 3.11                |
| Database  | MongoDB (via PyMongo)               |
| Auth      | JWT (python-jose / PyJWT)           |
| ML Model  | Scikit-learn (Random Forest)        |
| Scheduler | APScheduler                         |
| Styling   | Plain CSS (custom design system)    |

---


---

## ⚡ Getting Started

```bash
### Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload


### Frontend

cd frontend/livestock
npm install
npm start



