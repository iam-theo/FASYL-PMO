# AGENTS.md

## Project overview

FASYL PMO Portal — a project workflow management system for managing project lifecycles through 8 defined stages (Client Identification → Closure). React 19 + Vite 8 frontend, Express 5 + Prisma 5 + PostgreSQL backend. Monorepo layout (single `package.json`, pnpm workspace).

## Quick start

```bash
# Terminal 1 — frontend dev server (Vite, port 5173)
pnpm dev

# Terminal 2 — backend server (Express, port 5000)
pnpm server
```

Both must be running simultaneously. Frontend proxies API calls to `http://localhost:5000/api`.

## Required environment

- Copy `.env.bak` to `.env` and fill in real values. The backend loads `dotenv` from project root (`process.cwd()`).
- Required env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`. Optional: `PORT` (default 5000), `CLIENT_URL`, `NODE_ENV`.
- `DATABASE_URL` must point to PostgreSQL (Prisma datasource).

## Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test users (admin@test.com / user@test.com)
npx prisma db seed
```

Prisma schema: `backend/prisma/schema.prisma`. Generated client output is gitignored at `src/generated/prisma`.

## Lint

```bash
pnpm lint
```

ESLint flat config (`eslint.config.js`) — checks `**/*.{js,jsx}`, ignores `dist/`.

## No tests

There is no test framework, no test files, and no test scripts. Do not add test files unless asked.

## Architecture

### Frontend (`src/`)

- `src/main.jsx` → entry point, wraps app in `BrowserRouter` + `NotificationProvider`
- `src/App.jsx` → routes: `/` (SignIn), `/app` (MainBody, protected)
- `src/api.js` → axios instance pointing to `http://localhost:5000/api` (used by most components)
- `src/api/axios.js` → **different** axios instance pointing to `https://sflbk.com/api/v1` (production URL, has auto-refresh logic)
- Components: `components/auth/`, `components/layout/`, `components/projects/`

**Gotcha**: Two separate axios instances exist. `src/api.js` is for local dev. `src/api/axios.js` is the production-ready instance with token refresh. Check which one a component imports before modifying.

### Backend (`backend/`)

- `backend/server.js` — Express entry point, loads dotenv, mounts all routes, starts background jobs
- Modules organized by domain under `backend/modules/`:
  - `auth/` — authentication, JWT, bcrypt
  - `projects/` — CRUD, stage creation, sales sync
  - `workflow/` — 8-stage lifecycle engine (submit/approve/reject)
  - `tasks/` — task management
  - `reports/` — report generation
  - `reminders/` — scheduled reminders (cron-based)
- `backend/middleware/` — auth, RBAC, rate limiting, workflow guards
- `backend/utils/` — JWT helpers, password hashing, auth utilities
- `backend/config/` — multer (file uploads), swagger config
- `backend/constants/roles.js` — role definitions

### API routing

All routes are mounted at both `/api/v1/` and `/api/` (legacy compatibility). Swagger docs at `GET /docs`.

### Workflow engine

- 8 project stages with statuses: `LOCKED → OPEN → SUBMITTED → APPROVED/REJECTED`
- Stage policies defined in `backend/modules/workflow/workflow.policy.js`
- Stage keys: `client_identification`, `client_engagement`, `project_initiation`, `project_planning`, `project_execution`, `project_execution_uat`, `project_execution_golive`, `project_closure`
- Roles: `HEADOFOPS`, `PROJECTMANAGER`, `STAFF` — enforced via RBAC middleware

## Critical gotchas

1. **Module system**: `backend/modules/workflow/workflow.engine.js` and `workflow.utils.js` use **CommonJS** (`require`/`module.exports`) while the rest of the backend is ESM. Do not mix them.

2. **Prisma client**: `PrismaClient` is imported from `@prisma/client` everywhere. The custom singleton at `backend/prisma/prisma.client.js` exists but most backend files create their own `new PrismaClient()`. Be aware of multiple instances.

3. **pnpm workspace config**: `pnpm-workspace.yaml` has `allowBuilds` for prisma, bcrypt, and their engine packages. These are needed for native builds.

4. **Production URLs hardcoded**: `src/api/axios.js` has `https://sflbk.com/api` hardcoded in the refresh interceptor. The `VITE_API_URL` env var controls the base URL for the main instance.

5. **No .env in repo**: `.env` is gitignored. Only `.env.bak` exists with placeholder values.

6. **File uploads**: Handled via multer (`backend/config/multer.js`), stored in `backend/uploads/`, served statically at `/uploads`.

7. **Background jobs**: Sales sync (`salesSync.job.js`) and reminder scheduler (`reminder.scheduler.js`) start automatically with the server.
