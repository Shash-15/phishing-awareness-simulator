# 🎯 Phishing Awareness Simulator (GoPhish Integration)

A full-stack web application designed to improve cybersecurity awareness by simulating real-world phishing attacks in a safe and interactive environment.

---

## 📌 Overview

The **Phishing Awareness Simulator** helps users identify phishing attempts through realistic email simulations. It provides immediate feedback and tracks user performance to enhance learning outcomes.

This project was developed as part of a Master's program in Computer Science.

---

## 🚀 Key Features

- 🔐 User authentication (login system)
- 📧 Realistic phishing email simulations
- ⚠️ Detection of phishing indicators:
  - Suspicious URLs
  - Spoofed sender addresses
  - Urgency-based messages
- ✅ Instant feedback with explanation
- 📊 Performance dashboard
- 🧠 Progress tracking & scoring system
- 🔄 RESTful API communication
- 🗄️ SQLite database integration
- ⚡ Fast SPA using React + Vite
- 🔒 Secure backend proxy handling

---

## 🏗️ System Architecture

The application follows a **3-tier architecture**:

### Frontend
- Built with React (SPA)
- Handles UI, simulation display, and user interaction

### Backend
- Node.js with Express
- Processes logic, scoring, and API requests

### Database
- SQLite for storing:
  - User data
  - Simulation results
  - Performance metrics

---

## 📂 Project Structure
phishing-awareness-simulator/
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Application pages
│ │ ├── services/ # API calls
│ │ ├── assets/ # Images and styles
│ │ └── App.jsx
│ ├── index.html
│ └── package.json
│
├── backend/ # Node.js backend
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── middleware/ # Auth / validation
│ ├── config/ # DB configuration
│ ├── server.js # Entry point
│ └── package.json
│
├── database/
│ └── phishing.db # SQLite database
│
├── README.md
└── .gitignore

---

## 🛠️ Technologies Used

| Category | Technology |
|----------|------------|
| Frontend | React, Vite |
| Backend  | Node.js, Express |
| Database | SQLite |
| API      | REST API |
| Version Control | Git, GitHub |
| Simulation Tool | GoPhish |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository


git clone https://github.com/Shash-15/phishing-awareness-simulator.git
cd phishing-awareness-simulator

▶️ Frontend Setup
cd frontend
npm install
npm run dev
▶️ Backend Setup
cd backend
npm install
node server.js


📊 Performance
| Metric            | Result   |
| ----------------- | -------- |
| Page Load Time    | 148 ms   |
| API Response Time | < 200 ms |
| DB Query Time     | < 50 ms  |

🧪 Testing
✅ Functional Testing
✅ Integration Testing
✅ Performance Testing
✅ UI Testing


🔐 Security Features
Secure authentication validation
HTTPS-ready architecture
Backend proxy for external integrations
Protected API endpoints

ScreenShots

1.Home Page
<img width="922" height="451" alt="image" src="https://github.com/user-attachments/assets/70588522-435f-4d6c-8b1e-99cd44e2130a" />
2.Login Page
<img width="918" height="445" alt="image" src="https://github.com/user-attachments/assets/2781ba56-e5ff-4bb5-b2de-f47e663063f1" />
3.Dashboard
<img width="813" height="426" alt="image" src="https://github.com/user-attachments/assets/9f944da6-8234-47ac-bdbf-81eab2c83d58" />





