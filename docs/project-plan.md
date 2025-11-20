## Health & Fitness Tracker – Delivery Plan

### 1. Vision & Goals
- Help users log workouts, nutrition, biometrics, and goals in one place.
- Provide insights through dashboards, trends, and real-time progress alerts.
- Demonstrate the full MERN skillset: secure REST API, modern React UI, data viz, testing, deployment, and documentation.

### 2. Core Features
1. **Authentication & profiles**
   - Email/password signup & login using JWT httpOnly cookies.
   - Profile settings: avatar, age, height, weight goals, notification preferences.
2. **Workout tracking**
   - Create/edit/delete sessions with exercises, sets, reps, duration, perceived intensity.
   - Auto-calc volume & calories burned estimates.
3. **Nutrition logging**
   - Daily meals log, macros, hydration.
   - Optional barcode/manual lookup (MVP uses manual entry).
4. **Biometric & habit tracking**
   - Weight, body fat %, sleep, steps, mood.
   - Streaks and reminders.
5. **Data visualization**
   - Combined dashboard with charts (moving averages, line/bar/pie).
   - Highlight goal progress, weekly summaries, PR badges.
6. **Social / accountability (stretch)**
   - Share progress snapshots, follow friends, cheer via Socket.io real-time feed.

### 3. Architecture Overview
- **Frontend**: React + Vite, TypeScript, React Router, Zustand/Context for state, TanStack Query for data fetching, Victory/Recharts for charts, Tailwind UI.
- **Backend**: Node + Express, MongoDB via Mongoose, Socket.io for live updates, JWT auth with refresh tokens, Zod/express-validator for validation.
- **Infra**: .env for secrets, nodemon + ts-node-dev in dev, Jest + Supertest + mongodb-memory-server for tests, GitHub Actions for CI, deployment to Render (API) + Vercel/Netlify (UI).

### 4. Data Modeling (initial)
- `User`: profile info, auth creds, metrics settings, linked devices.
- `Workout`: owner, date, exercises[], notes, metrics.
- `ExerciseEntry`: name, sets[], equipment, RPE.
- `NutritionEntry`: meals[], calories, macros, water.
- `Biometrics`: weight logs, sleep, mood, vitals.
- `Goal`: type (weight, workout freq), targetValue, currentValue, dueDate, status.
- `Notification`: type, message, read, createdAt.

### 5. API Surface (MVP)
- Auth: `/api/auth/register`, `/login`, `/logout`, `/refresh`.
- Users: `/api/users/me`, `/me/settings`, `/me/stats`.
- Workouts: CRUD endpoints + `/workouts/summary`.
- Nutrition: CRUD + `/nutrition/summary`.
- Biometrics: CRUD + `/biometrics/weekly`.
- Goals: CRUD + `/goals/progress`.
- Feed (Socket.io namespace `/feed`): push achievements.

### 6. Frontend Routes & Views
- `/` dashboard with charts, quick-add buttons.
- `/login`, `/register`.
- `/workouts`, `/workouts/:id`.
- `/nutrition`.
- `/biometrics`.
- `/goals`.
- `/settings`.
- `/feed` (stretch).

### 7. Milestones
1. **Week 8 Day 1-2** – Discovery & planning (this doc, data modeling, tasks).
2. **Day 3-4** – Backend scaffolding, auth, core models, protected routes.
3. **Day 5-6** – Workout + nutrition endpoints with validation & tests.
4. **Day 7-8** – Frontend scaffolding, auth pages, API integration via TanStack Query.
5. **Day 9** – Dashboard visualizations, charts, summaries.
6. **Day 10** – Testing (unit/integration/e2e), accessibility, polish.
7. **Day 11** – Deployment scripts, CI, README, demo assets.

### 8. Deliverables Check
- ✅ Planning artifacts (this file, updated README).
- ✅ Backend + frontend folders with package setup.
- ✅ Tests (Jest, React Testing Library, Cypress).
- ✅ Documentation: API reference, setup guide, architecture notes.
- ✅ Deployment: Render API URL, Vercel frontend URL, .env instructions.
- ✅ Presentation: slide deck outline + Loom demo link.

### 9. Next Actions
1. Scaffold backend structure (src, config, controllers, routes, models, middleware).
2. Configure linting, formatting, testing scripts.
3. Implement authentication flow end-to-end with tests.
4. Build workout/nutrition/biometrics modules.
5. Start frontend setup (Vite+TS), theme, routing, auth pages.
6. Integrate charts and real-time features.
7. Finalize docs, deployment, and presentation.

