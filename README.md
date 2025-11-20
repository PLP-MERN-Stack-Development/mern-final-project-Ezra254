# VitalTrack – Health & Fitness Tracker

VitalTrack is a full-stack MERN capstone project focused on holistic health tracking, actionable insights, and rich data visualizations. Users can log workouts, track goals, create training plans, and monitor their progress through interactive dashboards with real-time synchronization.

> 📄 Original assignment requirements remain in `Week8-Assignment.md` for reference.

## Features

### 🔐 Authentication & User Management
- **Secure Registration & Login**: Email/password authentication with JWT tokens stored in httpOnly cookies
- **User Profile**: Access authenticated user information and manage account settings
- **Session Management**: Automatic token refresh and secure logout functionality
- **Protected Routes**: All user data is protected behind authentication middleware

### 🎯 Goal Tracking
- **Flexible Goal Types**: Create goals for workouts completed, active minutes, steps walked, calories burned, or weight change
- **Multiple Time Periods**: Set daily, weekly, or monthly targets
- **Progress Tracking**: Visual progress sliders to update your advancement toward goals
- **Goal Management**: Pause, activate, or delete goals as needed
- **Real-time Updates**: Goal changes instantly sync across the dashboard and all connected views

### 💪 Workout Logging
- **Comprehensive Workout Entry**: Log workouts with title, type (strength, conditioning, mobility, hybrid, endurance), intensity level, duration, and notes
- **Workout Status**: Track workouts as planned, completed, or skipped
- **Plan Integration**: Link workouts to training plans for organized tracking
- **Workout History**: View and filter all logged workouts by plan or date
- **Quick Edit**: Update workout details and notes directly from the activity log

### 📋 Training Plans
- **Custom Plan Creation**: Build personalized training plans with specific goals and focus areas
- **Session Scheduling**: Add multiple sessions per plan, assign them to days of the week, and set target durations
- **Plan Status Management**: Organize plans as draft, active, paused, or completed
- **Session Tracking**: Mark individual sessions as completed or planned with visual checkboxes
- **Progress Monitoring**: Track plan completion rates and see upcoming sessions on the dashboard

### 📊 Dashboard & Analytics
- **Performance Overview**: Real-time dashboard showing weekly goal progress, training load, calories burned, and hydration
- **Interactive Charts**: 
  - Weekly training minutes with area charts
  - Macro distribution visualization
  - Recovery readiness score
  - Strength vs conditioning breakdown
- **Live Statistics**: Auto-updating stat cards that reflect your latest workout and goal data
- **Upcoming Sessions**: Quick view of your next planned training sessions
- **Real-time Sync**: All dashboard widgets update instantly when you log workouts or modify goals

### 🔄 Real-time Synchronization
- **Socket.io Integration**: Live updates across all connected clients
- **Instant Feedback**: Changes to goals, workouts, or plans immediately reflect on the dashboard
- **Multi-device Support**: Keep your data synchronized across multiple browser sessions

### 📱 Responsive Design
- **Mobile-First**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Accessible**: Follows accessibility best practices for inclusive user experience

## Tech Stack
- **Frontend**: React + Vite (TS), React Router, TanStack Query, Zustand, Tailwind, Recharts/Victory
- **Backend**: Node.js + Express, MongoDB/Mongoose, Socket.io, JWT auth, express-validator, Jest + Supertest
- **Tooling**: TypeScript end-to-end, ts-node-dev, ts-jest, mongodb-memory-server, GitHub Actions (CI), Render + Vercel for deployment

## Repository Structure
```
mern-final-project-Ezra254
├─ backend
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ realtime/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ validators/
│  ├─ tests/                  # Jest + Supertest suites (TS & JS)
│  ├─ dist/                   # Transpiled JS output (tsc)
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend
│  ├─ public/
│  ├─ src
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ lib/
│  │  ├─ mocks/               # Demo-mode data + adapters
│  │  ├─ pages/
│  │  ├─ routes/
│  │  ├─ store/
│  │  ├─ types/
│  │  └─ main.tsx + assets
│  ├─ package.json
│  └─ tsconfig.*.json
├─ docs/                      # Planning artifacts & design notes
│  └─ project-plan.md
├─ README.md
└─ Week8-Assignment.md
```

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas connection string)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
cp .env.example .env   # Fill with your MongoDB URI and JWT secrets
npm install
npm run dev            # Start Express API with ts-node-dev (runs on port 5000)
npm test               # Run Jest + Supertest test suite
npm run build          # Compile TypeScript to JavaScript in dist/
```

**Required Environment Variables** (in `backend/.env`):
- `MONGODB_URI` – Your MongoDB connection string
- `JWT_ACCESS_SECRET` – Secret key for access tokens
- `JWT_REFRESH_SECRET` – Secret key for refresh tokens
- `CLIENT_URL` – Frontend URL (default: `http://localhost:5173`)
- `PORT` – Server port (default: 5000)
- `JWT_ACCESS_TTL` – Access token expiration (default: 15m)
- `JWT_REFRESH_TTL` – Refresh token expiration (default: 7d)
- `COOKIE_DOMAIN` – Cookie domain for production (optional)
- `LOG_LEVEL` – Logging level (default: info)

### Frontend Setup
```bash
cd frontend
cp .env.example .env   # Configure API endpoints
npm install
npm run dev    # Start Vite dev server (runs on port 5173)
npm run build  # Type-check and create optimized production bundle
npm run lint   # Run ESLint
```

**Environment Variables** (in `frontend/.env`):
- `VITE_API_URL` – Backend API URL (default: `http://localhost:5000/api`)
- `VITE_SOCKET_URL` – Socket.io server URL (default: `http://localhost:5000`)
- `VITE_DEMO_MODE` – Enable demo mode with mock data (default: `true`)

**Note**: Set `VITE_DEMO_MODE=false` when connecting to a real backend API.

### Backend API Endpoints

**Health & Status**
- `GET /health` – Service heartbeat
- `GET /api` – API root metadata
- `GET /api/healthcheck` – Health diagnostic endpoint

**Authentication** (Public)
- `POST /api/auth/register` – Create a new user account
- `POST /api/auth/login` – Authenticate and receive JWT tokens
- `POST /api/auth/refresh` – Refresh access token

**Authentication** (Protected)
- `GET /api/auth/me` – Fetch authenticated user profile
- `POST /api/auth/logout` – Log out and clear session

**Goals** (Protected)
- `GET /api/goals` – List all user goals
- `POST /api/goals` – Create a new goal
- `PATCH /api/goals/:id` – Update a goal (progress, target, status)
- `DELETE /api/goals/:id` – Delete a goal
- `GET /api/goals/summary/weekly` – Get weekly goal summary

**Workouts** (Protected)
- `GET /api/workouts` – List all user workouts (with optional filters)
- `POST /api/workouts` – Create a new workout entry
- `PATCH /api/workouts/:id` – Update a workout
- `DELETE /api/workouts/:id` – Delete a workout
- `GET /api/workouts/summary` – Get workout statistics and summaries

**Training Plans** (Protected)
- `GET /api/plans` – List all user training plans
- `POST /api/plans` – Create a new training plan
- `PATCH /api/plans/:id` – Update a plan (status, sessions, etc.)
- `DELETE /api/plans/:id` – Delete a plan
- `GET /api/plans/summary` – Get plan completion statistics

All protected endpoints require authentication via JWT tokens (sent via httpOnly cookies or Bearer token).

### Frontend Implementation
- **Modern React Stack**: Vite + React + TypeScript with Tailwind CSS for styling
- **State Management**: Zustand for authentication state, TanStack Query for server state
- **Routing**: React Router with protected routes and authentication guards
- **Real-time Updates**: Socket.io client integration for live data synchronization
- **Data Visualization**: Recharts integration for interactive charts and graphs
- **Responsive UI**: Mobile-first design with reusable components (`StatCard`, `ChartCard`, navigation)
- **Full CRUD Operations**: Complete interfaces for goals, workouts, and training plans
- **Live Dashboard**: Real-time metrics and visualizations that update automatically

## How to Use VitalTrack

### Getting Started

1. **Create an Account**
   - Navigate to the registration page (`/register`)
   - Enter your email and password to create a new account
   - You'll be automatically logged in after registration

2. **Set Up Your Goals**
   - Go to **Settings** → **Personalized coaching**
   - Click "Create goal" and select:
     - **Focus area**: Workouts, minutes, steps, calories, or weight
     - **Cadence**: Daily, weekly, or monthly
     - **Target value**: Your goal amount (e.g., 4 workouts per week)
   - Click "Add goal" to save
   - Use the progress slider to update your current progress
   - Toggle goals active/paused or delete them as needed

3. **Create a Training Plan**
   - Navigate to **Activity** → **Plans & Workout Log**
   - In the "Training plans" section, fill out:
     - Plan name and focus area
     - Outcome goal (what you want to achieve)
     - Start and end dates
   - Add session templates by clicking "Add" and specifying:
     - Day of the week
     - Session focus/title
     - Target duration in minutes
   - Click "Save plan" to create your plan
   - Set plan status to "Active" to start tracking

4. **Log Your Workouts**
   - In the **Activity** page, use the "Workout log" form
   - Enter:
     - Session title
     - Type (strength, conditioning, mobility, etc.)
     - Intensity level (easy, moderate, hard)
     - Date and duration
     - Optional: Attach to a training plan
     - Notes about your session
   - Click "Log workout" to save
   - View all your workouts below the form
   - Edit or delete workouts by clicking the respective buttons

5. **Track Your Progress**
   - Visit the **Dashboard** to see:
     - Your weekly goal progress
     - Total training minutes and sessions
     - Estimated calories burned
     - Visual charts of your activity
     - Upcoming sessions from your active plan
   - All metrics update in real-time as you log workouts

6. **Manage Your Data**
   - **Dashboard**: Overview of all your fitness metrics and progress
   - **Activity**: Create plans and log workouts
   - **Analytics**: Advanced insights and trends (coming soon)
   - **Settings**: Manage goals and account preferences

### Tips for Best Experience

- **Start with Goals**: Set up at least one weekly goal to see meaningful progress on the dashboard
- **Use Training Plans**: Create plans to organize your workouts and track completion
- **Log Regularly**: Consistent logging provides better insights and trend analysis
- **Link Workouts to Plans**: When logging workouts, attach them to your active plan to track plan completion
- **Update Progress**: Use the progress sliders in Settings to manually adjust goal progress if needed
- **Real-time Sync**: Open the app in multiple tabs to see real-time updates across all views

## Deployment
- **Backend**: Deployed on Render with automatic builds from the repository
- **Frontend**: Deployed on Vercel with static site generation
- **Real-time**: Socket.io connections work seamlessly across deployed environments
- **Environment Variables**: Configured via platform-specific environment variable management

### Cloud Deployment Guide

| Target | Config file | Build command | Start / Output |
| ------ | ----------- | ------------- | -------------- |
| Render (backend) | `render.yaml` | `npm run build` (inside `backend/`) | `npm run start` |
| Vercel (frontend) | `vercel.json` | `npm run build` (inside `frontend/`) | Static export in `frontend/dist` |

1. **Backend on Render**
   - Create a new Web Service using the repo and pick the root-level `render.yaml` blueprint.
   - Render now `cd`s into `backend/`, installs dependencies, runs `npm run build`, then launches `npm run start` automatically.
   - Provide the secrets listed in `render.yaml` (Mongo URI, JWT secrets, etc.). Set `CLIENT_URL` to your deployed Vercel domain and, once known, set `COOKIE_DOMAIN` accordingly.
   - Enable autoscaling/cron as needed; `LOG_LEVEL=info` keeps logs concise in production.

2. **Frontend on Vercel**
   - Import the repo in Vercel and keep the root as default; the root `vercel.json` runs install/build steps from `frontend/` for you.
   - Set the environment variables referenced in `vercel.json` (`VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_DEMO_MODE`) so the client points at the Render API. When the Render backend URL is finalized, update `VITE_API_URL` and `VITE_SOCKET_URL`.
   - The new rewrite rule ensures every SPA route falls back to the generated `index.html` that Vercel serves from `frontend/dist`.

3. **Local parity**
   - Keep `VITE_DEMO_MODE=true` for local previews without an API. In production (Vercel), set it to `false` so the client uses live endpoints.
   - Always run `npm run build` in both `backend/` and `frontend/` before deploying to catch TypeScript or lint regressions the hosts would otherwise fail on.

## Assignment Reference
For detailed grading criteria, deliverables, and presentation expectations, consult `Week8-Assignment.md`.

## Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom)