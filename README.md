# 🧬 OmniHealth — Clinical Intelligence & Trials Governance Portal

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini 2.5 Flash](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-8E75B2?logo=google&logoColor=white)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade, full-stack clinical research platform bridging global oncology & metabolic clinical trials with functional biomarker intelligence, daily lifestyle interventions, patient-advocate translation, and role-based administrative governance.

---

## ⚡ 1-Click Instant Launch & Deployment

Launch the entire full-stack application directly in your browser with zero local configuration:

| Platform | Launch Method | Target |
| :--- | :--- | :--- |
| **GitHub Codespaces** | [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new) | Instant Cloud IDE + Live Web Preview (Port 3000) |
| **StackBlitz** | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com) | In-Browser WebContainer Execution |
| **Render** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy) | Backend + Full-Stack Production Service |
| **Vercel** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new) | Client-Side SPA Edge Deployment |
| **Gitpod** | [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com) | Automated Container Workspace |

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │            CLIENT LAYER (React 19)           │
                               │  Vite • Tailwind CSS v4 • Lucide • Recharts  │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTP / REST / JSON
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │        BACKEND LAYER (Node.js + Express)     │
                               │  • JWT Auth & Google 1-Click OAuth Gateway   │
                               │  • Role-Based Access Control (RBAC)          │
                               │  • Audit Trail & Real-time Security Logger   │
                               │  • API Rate Limiting & Telemetry Engine      │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
        ┌──────────────────────────────┐                              ┌──────────────────────────────┐
        │       GEMINI 2.5 FLASH       │                              │     PERSISTENCE & STORAGE    │
        │   • Clinical Trial Analysis  │                              │   • User Profile & History   │
        │   • Biomarker Interpretation │                              │   • Bookmarks & Audit Logs   │
        │   • 9-Language Translation   │                              │   • System Configuration     │
        └──────────────────────────────┘                              └──────────────────────────────┘
```

---

## 👥 User Roles & Access Control Matrix

| Feature / Capability | Standard User | Super Administrator |
| :--- | :---: | :---: |
| **Explore Clinical Trials & PubMed Papers** | ✅ | ✅ |
| **Biomarker Lab Analyzer & Norms Engine** | ✅ | ✅ |
| **Intervention & Lifestyle Protocol Planner** | ✅ | ✅ |
| **Biometric Telemetry & Wearable Trends** | ✅ | ✅ |
| **Multilingual AI Clinical Assistant (Gemini)** | ✅ | ✅ |
| **Doctor Consultation Summary Generator** | ✅ | ✅ |
| **User Profile Management & Saved Bookmarks** | ✅ (Own data only) | ✅ |
| **User Accounts Governance (Edit Roles, Suspend)** | ❌ (Denied) | ✅ |
| **Immutable Security & Audit Trail Stream** | ❌ (Denied) | ✅ |
| **Live Server Health & Node.js Resource Metrics** | ❌ (Denied) | ✅ |
| **Global System Flags (Maintenance, Rate Limits)** | ❌ (Denied) | ✅ |
| **One-Click Database Re-Seed Engine** | ❌ (Denied) | ✅ |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20.x or higher)
- [npm](https://www.npmjs.com/) (version 10.x or higher)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/omnihealth-portal.git
cd omnihealth-portal
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and set your key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🐳 Docker Local Launch

Run the entire full-stack application locally with a single command:

```bash
docker compose up --build
```
The application will automatically bind to port `3000` with container healthchecks enabled.

---

## 📋 REST API Endpoints

### Authentication & Users
- `POST /api/auth/google` — Google 1-Click OAuth authentication
- `POST /api/auth/login` — Email/password login with JWT generation
- `POST /api/auth/register` — New researcher account creation
- `PUT /api/users/profile` — Update user profile details
- `POST /api/users/save-item` — Bookmark/unbookmark clinical trials & biomarkers

### Clinical & AI Services
- `POST /api/chat` — Multilingual clinical AI reasoning (Gemini 2.5 Flash)
- `POST /api/analyze-biomarker` — Functional lab analysis & reference range evaluator
- `POST /api/summarize-trial` — Dual-mode trial summarizer (Patient vs Clinician)
- `GET /api/health` — Platform health check

### Super Admin (Role-Protected)
- `GET /api/admin/stats` — Overall KPI metrics, API counts, and token usage
- `GET /api/admin/users` — User management listing
- `PATCH /api/admin/users/:id/role` — Promote/demote user roles
- `PATCH /api/admin/users/:id/status` — Suspend or activate user accounts
- `DELETE /api/admin/users/:id` — Delete user account
- `GET /api/admin/logs` — Immutable audit log feed
- `GET /api/admin/settings` — Retrieve system configuration flags
- `POST /api/admin/settings` — Update maintenance mode, rate limits, and AI parameters
- `GET /api/admin/server-health` — Real-time memory and uptime telemetry
- `POST /api/seed` — Trigger default database seed

---

## 🛡️ Security & Privacy
- **API Key Guard**: Gemini API keys and secrets reside strictly in the Express backend and are never exposed to the client.
- **Input Sanitization**: Request bodies are type-validated with structured JSON limits.
- **Audit Trails**: Security actions (logins, role elevations, deletions) are logged with IP addresses and timestamps.
- **Medical Disclaimer**: OmniHealth provides research synthesis and clinical literature references for informational purposes only. Always consult a licensed healthcare professional for medical diagnoses or treatment modifications.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
