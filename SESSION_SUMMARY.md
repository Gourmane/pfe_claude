# Session Summary — AI IT Assistant Platform (PFE)

_Last updated: 2026-03-31_

---

## Project Overview

**Name:** AI IT Assistant Platform
**Type:** PFE MVP — AI-powered IT Support Ticket Management System
**Stack:**
- Backend: Laravel 12 + Sanctum + Groq AI (port 8000)
- Frontend: React 19 + Vite 8 + Tailwind CSS 4 + React Router v7 + Axios (port 5173)
- DB: MySQL

---

## What Was Accomplished This Session

### 1. Backend — Fully audited and fixed

All backend issues from the PRD audit have been resolved. The backend is considered **done**.

**Fixes applied:**
| Fix | File |
|-----|------|
| CORS configured for localhost:5173 | `backend/config/cors.php` |
| Sanctum: added localhost:5173, token expiry 24h | `backend/config/sanctum.php` |
| Removed test endpoints that leaked role info | `TestRoleController.php` deleted |
| Added `GET /api/technicians` (admin-only, for dropdown) | `TechnicianController.php` created |
| Added ticket filtering: status, priority, client_id, search | `TicketController.php` |
| Changed ticket update from PUT → PATCH | `routes/api.php` |
| Added technician dashboard `GET /api/technician/dashboard` | `DashboardController.php` |
| Admin can comment on any ticket (not technicien-only) | `TicketCommentController.php` |
| Standardized all JSON responses to `{ message, data }` | All controllers |
| Rate-limited AI endpoint (10 req/min) | `routes/api.php` |

**Verified:** `php artisan route:list` shows 24 routes. `php artisan test` passes.

**Backend response format (must know for frontend):**
```json
// Standard
{ "message": "...", "data": { ... } }

// Login only (token is flat sibling)
{ "message": "...", "token": "...", "data": { user object } }

// Paginated lists
{ "message": "...", "data": { "data": [...], "meta": { ... } } }

// AI summary (source is flat sibling)
{ "message": "...", "data": { ... }, "source": "groq|keyword" }
```

---

### 2. Frontend — Phase 1 partially complete

**What exists in `frontend/src/` right now:**
```
src/
├── api/
│   └── axios.js         ✅ DONE — Axios instance with interceptors
├── App.jsx              ✅ DONE — Simple Tailwind heading (boilerplate replaced)
├── index.css            ✅ DONE — @import "tailwindcss" only
├── main.jsx             (unchanged, wraps App)
├── assets/              (still has default Vite assets — can be deleted)
├── components/          ✅ folder created (empty)
├── context/             ✅ folder created (empty)
├── hooks/               ✅ folder created (empty)
├── layouts/             ✅ folder created (empty)
├── pages/               ✅ folder created (empty)
└── router/              ✅ folder created (empty)
```

**`frontend/.env` exists:**
```
VITE_API_URL=http://localhost:8000/api
```

**`frontend/src/api/axios.js` — final correct implementation:**
```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Request: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response: 401 cleanup only — NO redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      Object.keys(localStorage)
        .filter((key) => /auth/i.test(key))
        .forEach((key) => localStorage.removeItem(key))
    }
    return Promise.reject(error)
  },
)

export default api
```

**What Phase 1 still needs (before moving to Phase 2):**
- `src/assets/` contents deleted and `App.css` deleted
- The domain API service files do NOT exist yet:
  - `src/api/auth.js`
  - `src/api/clients.js`
  - `src/api/tickets.js`
  - `src/api/dashboard.js`

These are Phase 2's first task (per the plan).

---

### 3. FRONT_PLAN.md — Finalized

Location: `frontend/FRONT_PLAN.md`

The plan was created and then updated with **10 review corrections**. It is now finalized.

**Key rules locked in the plan (must not be changed during implementation):**

| Rule | Detail |
|------|--------|
| 401 handling | Axios interceptor clears token + user + any persisted auth data. NO redirect. Routing stays in React. |
| API services | Per-domain files: `api/auth.js`, `api/clients.js`, `api/tickets.js`, `api/dashboard.js` |
| Auth loading | `ProtectedRoute` and `RoleRoute` must wait for `loading === false` before routing. Show spinner while loading. |
| Error normalization | Use `normalizeError(err)` — extracts message from any API error shape (422, generic, fallback) |
| Logout cleanup | Always clear token + user from localStorage AND state. Same cleanup on failed `GET /me`. |
| Filter URL sync | Ticket filters synced with `useSearchParams` (survives refresh) |
| Page state pattern | Always: loading → error → empty → content (in that order) |
| Async action pattern | set loading → clear error → try/catch normalizeError → finally stop loading |
| Refetch strategy | After create/update/delete: refetch from API. No optimistic updates. |
| Testing edge cases | Test: empty data, 422 errors, expired token (401), long text, rapid clicks, pagination |

---

## Implementation Phases — Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Clean Vite Boilerplate + Axios | 🟡 Partial (axios.js + folders done; domain api files missing, assets not cleaned) |
| 2 | Auth Context + Login Page | ⬜ Not started |
| 3 | Router + Route Guards + Layouts | ⬜ Not started |
| 4 | Shared UI Components | ⬜ Not started |
| 5 | Admin Dashboard | ⬜ Not started |
| 6 | Client Management (CRUD) | ⬜ Not started |
| 7 | Ticket List + Filters | ⬜ Not started |
| 8 | Ticket Creation | ⬜ Not started |
| 9 | Ticket Detail + Status + Comments + AI | ⬜ Not started |
| 10 | Technician Dashboard | ⬜ Not started |
| 11 | Polish, QA, Demo Readiness | ⬜ Not started |

---

## Key Backend API Reference (for frontend implementation)

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/login` | No | — | Login, returns token |
| POST | `/api/logout` | Yes | Any | Logout, revoke token |
| GET | `/api/me` | Yes | Any | Get current user |
| GET | `/api/dashboard` | Yes | admin | Admin dashboard stats |
| GET | `/api/technician/dashboard` | Yes | technicien | Tech personal stats |
| GET | `/api/technicians` | Yes | admin | List technicians (for dropdown) |
| GET/POST | `/api/clients` | Yes | admin | List / create clients |
| GET/PATCH/DELETE | `/api/clients/{id}` | Yes | admin | Read / update / delete client |
| GET/POST | `/api/tickets` | Yes | any | List (filtered) / create ticket |
| GET/PATCH | `/api/tickets/{id}` | Yes | any | Read / update ticket |
| POST | `/api/tickets/{id}/assign` | Yes | admin | Assign ticket to technician |
| POST | `/api/tickets/{id}/status` | Yes | any | Transition ticket status |
| GET/POST | `/api/tickets/{id}/comments` | Yes | any | List / add comment |
| POST | `/api/tickets/{id}/ai-summary` | Yes | any | Generate AI summary |

**Ticket categories (use exact values with accents):** `PC`, `Imprimante`, `Réseau`, `Caméra`, `Autre`

**Ticket status flow:** `pending` → `in_progress` → `resolved` → `closed`

**Roles:** `admin`, `technicien`

---

## Business Rules (critical for frontend)

- Admin creates clients and tickets. No client self-registration.
- Technicien can only see/act on assigned tickets.
- Admin can comment on any ticket. Technicien only on assigned tickets.
- `technician_id` is nullable — unassigned tickets are valid.
- A client with tickets cannot be deleted.
- AI summary uses Groq API with keyword fallback (may be slow — show loading state).

---

## Important Conventions

### Auth storage
- Token stored in `localStorage` as `"token"`
- User stored in `localStorage` as `"user"` (JSON)
- On 401 or logout: clear both + any `/auth/i` matching keys

### Axios instance
- Always import from `src/api/axios.js` (the configured instance), never from `axios` directly

### Routing decisions
- NEVER navigate/redirect inside `axios.js` interceptor
- Auth state is managed in `AuthContext`
- Route guards (`ProtectedRoute`, `RoleRoute`) handle all redirects after reading auth state

---

## Files to Know

| File | Purpose |
|------|---------|
| `backend/PRD.md` | Product Requirements — source of truth |
| `CLAUDE.md` | Project rules for Claude (roles, rules, conventions) |
| `frontend/FRONT_PLAN.md` | Complete phased frontend implementation plan |
| `frontend/src/api/axios.js` | Axios instance (done) |
| `frontend/.env` | `VITE_API_URL=http://localhost:8000/api` |

---

## How to Start the Next Session

1. **Backend** — run from `backend/`:
   ```bash
   php artisan serve
   ```

2. **Frontend** — run from `frontend/`:
   ```bash
   npm run dev
   ```

3. **Pick up at Phase 1 completion**, then move to Phase 2.

   Phase 1 remaining tasks:
   - Delete `src/assets/` contents and `src/App.css`
   - Create `src/api/auth.js`, `src/api/clients.js`, `src/api/tickets.js`, `src/api/dashboard.js`

   Then Phase 2: AuthContext + useAuth hook + LoginPage.

4. **Use `frontend/FRONT_PLAN.md`** as the execution guide — send only the relevant phase section to Codex per session.
