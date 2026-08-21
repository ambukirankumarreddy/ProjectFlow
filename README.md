# ProjectFlow AI - Enterprise Project & Task Management Platform

An AI-powered, multi-tenant engineering and task management platform designed for complex multidisciplinary defense, simulation, and software projects.

## 🚀 Key Features

* **8-Role Role-Based Access Control (RBAC)**: Super Admin, Organization Admin, Project Manager, Team Lead, Developer/Member, QA Engineer, Procurement Officer, Client Representative.
* **3-Tier Manpower Organization & Reporting Tree**: Functional Manager, Project Lead, and Administrative Manager hierarchy.
* **Indian Currency (INR — ₹) & Localization**: Standard Lakhs/Crores formatting (`₹5,40,00,000`), 18% GST calculation, Financial Year April–March, Date format `DD/MM/YYYY`, Timezone `Asia/Kolkata` (IST).
* **Google Authentication & Domain Enforcement**: Office email domain validation (`@edgeforce.in`), 2FA OTP (`123456`) protection.
* **Real-Time Communication Hub & Floating Chat Dock**: 1:1 DMs, Project channels, Team channels, Department channels, Task chats, Organization broadcasts, FlowPilot AI Assistant, and Client communication portal with voice notes, file attachments, and message-to-task conversion.
* **Notification Centre & 5-Tier Web Audio Synthesizer**: 14 category filters, synthesized sound effects without external audio files, and repeating emergency siren with mute controls.
* **5-Stage Manpower Escalation Hierarchy**: Automated SLA escalation of blocked tasks up the reporting hierarchy (`Assignee → Team Lead → Project Lead → Delivery Head → MD`).

---

## 📁 Repository Structure

```text
projectflow-ai/
├── database/
│   └── schema.sql              # Complete PostgreSQL DDL (tables, enums, FKs, indexes)
├── server/                     # Backend API & WebSocket Server (Node.js/Express/TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts            # Server entry point & WebSocket gateway
│       ├── controllers/        # Auth & business logic controllers
│       ├── middleware/         # JWT authentication & RBAC middleware
│       ├── routes/             # REST endpoints (auth, org, users, tasks, chat, notifications)
│       ├── db/                 # PostgreSQL connection pool
│       └── sockets/            # Real-time WebSocket broadcasting
├── src/                        # Frontend Application (React 18 + Vite + TypeScript + Tailwind)
│   ├── components/             # UI Components (Chat, Alerts, Boards, Gantt, Manpower, BOM)
│   ├── context/                # AppContext state & live event handlers
│   ├── types/                  # Domain TypeScript interfaces
│   ├── utils/                  # Web Audio Synthesizer, INR formatters
│   └── data/                   # Initial seed data
├── .env.example                # Sample environment configuration
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
└── README.md
```

---

## ⚙️ Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Setup Database
Execute the PostgreSQL DDL script against your local or cloud PostgreSQL instance:
```bash
psql -U postgres -d projectflow_ai_db -f database/schema.sql
```

### 3. Run Backend API Server
```bash
cd server
npm install
npm run dev
```
Backend API will start at: `http://localhost:5000`

### 4. Run Frontend Client
```bash
npm install
npm run dev
```
Frontend client will start at: `http://localhost:5174`

---

## 🔒 Security Note
This repository contains zero hardcoded production credentials, OAuth client secrets, or private keys. Always provide secure environment variables in `.env` before deploying to production.
