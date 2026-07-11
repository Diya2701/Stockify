# 📈 Stockify

> ### AI-Powered Portfolio Intelligence Platform

Stockify is a full-stack MERN application that helps investors **understand their portfolio instead of just tracking it**.

Unlike traditional stock market platforms that primarily display charts and numbers, Stockify leverages **Artificial Intelligence** to transform portfolio data into personalized, actionable insights. It analyzes investment behavior, evaluates portfolio health, identifies potential risks, and provides recommendations tailored to each investor's financial profile.

The platform consists of two major AI modules:

### 📊 AI Portfolio Analyzer
An intelligent portfolio analysis engine that automatically evaluates a user's investments by calculating:

- Portfolio Health Score
- Total Investment & Current Portfolio Value
- Overall Profit/Loss
- Portfolio Diversification
- Sector-wise Exposure
- Concentration Risk
- Risk Level Assessment
- Best & Worst Performing Holdings
- Asset Allocation
- AI-generated Portfolio Insights & Recommendations

Every buy or sell transaction dynamically updates the portfolio, ensuring that the analysis always reflects the latest investment data.

---

### 🧠 Personalized Investment Advisor

Stockify also features a personalized AI advisor that first understands the investor before providing recommendations.

It considers factors such as:

- Age
- Occupation
- Income Range
- Investment Goals
- Risk Tolerance
- Investment Horizon
- Emergency Fund
- Current Investments
- Preferred Sectors
- Investment Preference

Based on this information, the AI generates a comprehensive investment report containing:

- Portfolio Compatibility Score
- Investment Style
- Risk Personality
- Recommended Asset Allocation
- Personalized Recommendations
- Strengths & Weaknesses
- Missing Sectors
- Risk Warnings
- AI Suggested Next Steps
- Advisory Notes
- Learning Resources

---

# 🛠 Tech Stack

## Frontend

- React.js
- Material UI (MUI)
- Bootstrap
- Chart.js
- Axios
- React Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- RESTful APIs

## Artificial Intelligence

- Google Gemini API
- Gemini 2.5 Flash
- Retrieval-Augmented Generation (RAG)
- Prompt Engineering

## Deployment

- Vercel (Landing Page)
- Vercel (Dashboard)
- Render (Backend)
- MongoDB Atlas

---

# 📂 Project Structure

```text
Stockify/
│
├── frontend/
│   ├── public/
│   └── src/
│
├── dashboard/
│   ├── public/
│   └── src/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── prompts/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── index.js
│
└── README.md
```

---

# ⚙️ Local Setup

## Prerequisites

- Node.js (v18 or above)
- MongoDB Atlas (or Local MongoDB)
- Google Gemini API Key

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Diya2701/Stockify.git

cd Stockify
```

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install

npm start
```

Create a `.env` file inside the **backend** folder.

```env

MONGO_URL=

SESSION_SECRET=

GEMINI_API_KEY=

```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## 4️⃣ Dashboard Setup

```bash
cd dashboard

npm install

npm start
```

---

# 🚀 How It Works

1. Register or log in securely using JWT Authentication.
2. Buy and sell virtual stocks through the dashboard.
3. Every transaction automatically updates your holdings, positions, wallet, and portfolio.
4. The **AI Portfolio Analyzer** evaluates your investments and calculates important portfolio metrics.
5. The **Personalized Investment Advisor** analyzes your financial profile and generates customized investment recommendations.
6. AI provides beginner-friendly insights, risk analysis, diversification suggestions, and actionable next steps.
7. The dashboard visualizes all portfolio metrics using interactive charts and analytics.

---

# 🚀 Future Enhancements

- 📈 Live Stock Market API Integration
- 🏦 Brokerage Account Integration
- 📰 AI-powered Market News Summaries
- 🔔 Price Alerts & Notifications
- 📄 Portfolio Report Export (PDF)
- 🌙 Dark Mode
- 📱 Mobile Application

---

# 👨‍💻 Developed By

**Diya Dewangan**

B.Tech, Electronics & Communication Engineering  
National Institute of Technology Raipur

- GitHub: https://github.com/Diya2701
- LinkedIn:https://www.linkedin.com/in/diya-dewangan-62b27028a