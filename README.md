# VitalTrack – Health & Fitness Tracker

VitalTrack is a full-stack MERN capstone project focused on holistic health tracking, actionable insights, and rich data visualizations. Users can log workouts, nutrition, biometrics, and goals while receiving trend analysis and real-time encouragement.

> 📄 Original assignment requirements remain in `Week8-Assignment.md` for reference.

## Feature Goals
- Secure authentication with profile management and preference settings
- CRUD APIs for workouts, nutrition, biometrics, and goal tracking
- Aggregated stats (weekly volume, macro balance, sleep trends, streaks)
- Data visualizations (progress charts, moving averages, personal records)
- Real-time feed (Socket.io) for accountability and celebration
- Comprehensive tests, documentation, and deployment automation

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

## Backend – Getting Started
```bash
cd backend
cp .env.example .env   # fill with your secrets (see Goal Management section)
npm install
npm run dev            # start Express API with ts-node-dev
npm test               # run Jest + Supertest suite
npm run build          # emit compiled JS to dist/
```

The backend currently exposes:
- `GET /health` – service heartbeat
- `GET /api` – API root metadata
- `GET /api/healthcheck` – health diagnostic
- `POST /api/auth/register` – create account
- `POST /api/auth/login` – authenticate and receive tokens
- `GET /api/auth/me` – fetch authenticated user (requires cookie/Bearer token)

More modules (workouts, nutrition, biometrics, goals, real-time feed) are tracked in `docs/project-plan.md` and will land in upcoming milestones.

## Frontend – Getting Started
```bash
cd frontend
npm install
npm run dev    # launches Vite dev server with Tailwind + React Query
npm run build  # type-check + optimized production bundle
```

### Frontend Status
- Vite + React + TypeScript + Tailwind scaffold with QueryClient + React Router
- Dashboard preview with cards, Recharts visualizations, and responsive layout
- Authentication forms (login/register) wired to `useAuthStore` + axios client (ready for API)
- Shared UI components (`StatCard`, `ChartCard`, navigation shell) to accelerate future pages
- Interactive goal management experience on the Settings page (create, update, pause, delete)

Set `VITE_API_URL` in a new `frontend/.env` to point at the backend (defaults to `http://localhost:5000/api`).  
To preview the UI without a running API, keep `VITE_DEMO_MODE=true` — the frontend will hydrate mock data instantly.

## Goal Management & Realtime Sync
The dashboard, Settings page, and activity feed are now driven by live goal data.

1. **Configure environment files**
   - Backend: copy `.env.example` to `.env`, set `CLIENT_URL=http://localhost:5173`, update Mongo + JWT secrets as needed.
   - Frontend: copy `.env.example` to `.env` (or use the provided defaults) and set `VITE_API_URL` plus `VITE_SOCKET_URL` if the API runs on a non-default port. Leave `VITE_DEMO_MODE=true` for instant sample data, or switch it off when pointing at a real backend.
2. **Start services**
   - `npm run dev` inside `backend/` (Express + Socket.io, MongoDB required)
   - `npm run dev` inside `frontend/` (Vite on port 5173)
3. **Register or log in**
   - Visit `http://localhost:5173/register` to create a profile. Auth cookies are set automatically.
4. **Manage goals from Settings**
   - Open the **Settings → Personalized coaching** screen to add weekly/daily/monthly targets, adjust progress with the slider, pause or delete goals, and change target values inline.
   - Changes emit realtime events (`goals:changed`) so the dashboard cards and analytics refresh without manual reloads.

With this flow you can keep goals, workouts, and plans in sync—any updates made from Settings instantly reflect on the dashboard and activity planners.

## Frontend & Deployment
- Deployment targets: Render (API) + Vercel (web); CI/CD pipeline draft coming soon
- Upcoming: connect dashboard to live APIs, add TanStack Query hooks, integrate charts with backend metrics, automate deployments

## Assignment Reference
For detailed grading criteria, deliverables, and presentation expectations, consult `Week8-Assignment.md`.

## Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom)