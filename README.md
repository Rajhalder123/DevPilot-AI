# DevPilot AI 🚀

**Your AI-Powered Developer Career Platform**

Analyze resumes, review GitHub repos, ace interviews, and land your dream job — all powered by GPT-4o.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-20+-green)

---

## ✨ Features

| Feature                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| **Resume Analyzer**        | AI-powered scoring, keyword gaps, ATS optimization      |
| **GitHub Analyzer**        | Code quality, architecture review, tech stack detection |
| **Smart Job Matching**     | Personalized recommendations based on your profile      |
| **Interview Simulator**    | Real-time AI interviews with WebSocket chat             |
| **Cover Letter Generator** | Personalized cover letters for any posting              |
| **Skill Roadmap**          | Custom learning path to reach career goals              |

---

## 🏗️ Architecture

```
devpilot-ai/
├── frontend/          # Next.js 15 + TypeScript + Tailwind
├── backend/           # Express.js + MongoDB + Socket.IO
├── docker-compose.yml
├── .env.example
└── README.md
```

**Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Socket.IO Client  
**Backend**: Express.js, MongoDB (Mongoose), JWT auth, OpenAI GPT-4o, Socket.IO  
**DevOps**: Docker, Docker Compose

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone & Setup

```bash
git clone <repo-url>
cd devpilot-ai
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Backend

```bash
cd backend
npm install
cp ../.env .env      # or create backend/.env with backend-specific vars
npm run dev          # Starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install

# Create frontend/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5000" >> .env.local

npm run dev          # Starts on http://localhost:3000
```

### 4. Docker (Alternative)

```bash
# Set env vars in .env then:
docker-compose up --build
```

---

## 🔑 Environment Variables

| Variable               | Required | Description                                     |
| ---------------------- | -------- | ----------------------------------------------- |
| `MONGODB_URI`          | ✅        | MongoDB connection string                       |
| `JWT_SECRET`           | ✅        | Secret for JWT signing                          |
| `OPENAI_API_KEY`       | ✅        | OpenAI API key for AI features                  |
| `GITHUB_CLIENT_ID`     | ❌        | GitHub OAuth app client ID                      |
| `GITHUB_CLIENT_SECRET` | ❌        | GitHub OAuth app secret                         |
| `FRONTEND_URL`         | ❌        | Frontend URL (default: `http://localhost:3000`) |

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/auth/signup`           | Register new user          |
| POST   | `/api/auth/login`            | Login with email/password  |
| GET    | `/api/auth/github`           | GitHub OAuth redirect      |
| GET    | `/api/auth/me`               | Get current user           |
| POST   | `/api/resume/upload`         | Upload resume PDF          |
| POST   | `/api/resume/analyze`        | Analyze uploaded resume    |
| POST   | `/api/github/analyze`        | Analyze GitHub repository  |
| POST   | `/api/jobs/recommend`        | Get AI job recommendations |
| POST   | `/api/interview/start`       | Start interview session    |
| POST   | `/api/cover-letter/generate` | Generate cover letter      |
| GET    | `/api/dashboard/stats`       | Get user dashboard stats   |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 20
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Express.js, Mongoose, Socket.IO
- **AI**: OpenAI GPT-4o
- **Auth**: JWT + GitHub OAuth
- **Database**: MongoDB
- **Animations**: Framer Motion
- **DevOps**: Docker, Docker Compose

---

## 📝 License

MIT © DevPilot AI
# new
