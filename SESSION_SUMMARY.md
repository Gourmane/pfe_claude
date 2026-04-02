# Session Summary — AI IT Assistant Platform (PFE)

_Last updated: 2026-04-02_

---

## 1. Project Overview

**Name:** AI IT Assistant Platform
**Type:** PFE MVP — AI-powered IT Support Ticket Management System

**What it does:** A web application for managing IT support tickets. Admin users create clients, open tickets, assign technicians, and oversee operations. Technicians handle assigned tickets, update status, and add comments. An AI integration (Groq) provides ticket summarization and category suggestions.

**Target users:**
- `admin` — manages clients, creates/assigns tickets, views all data
- `technicien` — handles assigned tickets only, updates status, adds comments

**Stack:**
- Backend: Laravel 12 + Sanctum + Groq AI (port 8000) — **fully built and tested**
- Frontend: React 19 + Vite 8 + Tailwind CSS 4 + React Router v7 + Axios (port 5173)
- Database: MySQL

---

## 2. Current Implementation Status

**Backend:** Complete. All 24 API endpoints working.

**Frontend:** All 11 phases complete. Project is demo-ready and audited.

| Phase | Name | Status |
|-------|------|--------|
| 1 | Foundation (Tailwind, Axios, folders, .env) | Done |
| 2 | Auth System (AuthContext, LoginPage) | Done |
| 3 | Routing + Layouts + Guards | Done |
| 4 | Shared UI Components (8 components) | Done |
| 5 | Admin Dashboard (stats + recent tickets) | Done |
| 6 | Client Management (full CRUD) | Done |
| 7 | Ticket List + Filters (admin + technician) | Done |
| 8 | Ticket Creation (admin form) | Done |
| 9 | Ticket Detail + Status + Comments + AI | Done |
| 10 | Technician Dashboard | Done |
| 11 | Polish, QA, Demo Readiness | Done |

**Audit:** `REVIEW_ALL.md` created at project root. All critical and major issues fixed.

---

## 3. Architecture

### Folder structure
```
frontend/src/
├── api/
│   ├── axios.js              # Configured Axios instance (interceptors)
│   ├── auth.js               # login(), logout(), getMe()
│   ├── clients.js            # getClients(), getClient(), createClient(), updateClient(), deleteClient()
│   ├── dashboard.js          # getAdminDashboard(), getTechnicianDashboard()
│   ├── technicians.js        # getTechnicians()
│   └── tickets.js            # getTickets(), getTicket(), createTicket(), updateTicket(),
│                             # updateTicketStatus(), assignTicket(), addTicketComment(),
│                             # generateTicketSummary()
├── context/
│   └── AuthContext.jsx        # AuthProvider (user, token, login, logout, loading)
├── hooks/
│   └── useAuth.js             # Hook to consume AuthContext
├── layouts/
│   ├── AuthLayout.jsx         # Centered layout for login
│   ├── AdminLayout.jsx        # Sidebar + header for admin (French labels)
│   └── TechnicianLayout.jsx   # Sidebar + header for technician (French labels)
├── pages/
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── admin/
│   │   ├── DashboardPage.jsx      # Stats cards + recent tickets table
│   │   ├── ClientsPage.jsx        # Search + paginated table + delete modal
│   │   ├── ClientCreatePage.jsx   # Form → POST /clients
│   │   ├── ClientEditPage.jsx     # Form → PUT /clients/{id}
│   │   ├── TicketsPage.jsx        # Filters + paginated table + URL sync
│   │   ├── TicketCreatePage.jsx   # Form → POST /tickets
│   │   └── TicketDetailPage.jsx   # Full detail: edit, assign, status, comments, AI
│   └── technician/
│       ├── DashboardPage.jsx      # Stats (assigned/in_progress/resolved) + recent tickets
│       ├── TicketsPage.jsx        # Filters + paginated table (assigned only)
│       └── TicketDetailPage.jsx   # View-only: status transitions, comments (if assigned), AI
├── components/
│   ├── ui/                        # 8 shared primitives
│   │   ├── Alert.jsx              # success/error/info with optional close
│   │   ├── Badge.jsx              # Status + priority color mapping
│   │   ├── Button.jsx             # primary/secondary/danger + loading
│   │   ├── EmptyState.jsx         # Message + optional action
│   │   ├── Input.jsx              # Label + error + aria
│   │   ├── Modal.jsx              # Overlay + backdrop close
│   │   ├── Pagination.jsx         # Page numbers + prev/next (French labels)
│   │   └── Spinner.jsx            # Centered animated spinner
│   ├── clients/
│   │   └── ClientForm.jsx         # Shared create/edit form (nom, telephone, email, adresse, entreprise)
│   ├── tickets/
│   │   ├── TicketFilters.jsx      # Status/priority/client/search dropdowns
│   │   ├── TicketForm.jsx         # Title/desc/priority/client form
│   │   ├── StatusTransitionButton.jsx  # Role-aware status transitions
│   │   ├── CommentSection.jsx     # Comment list + add form (canComment prop)
│   │   └── AssignTechnicianSection.jsx # Technician dropdown + assign button (admin only)
│   └── ai/
│       ├── AiSummaryCard.jsx      # Displays AI summary + suggested_category
│       └── GenerateSummaryButton.jsx  # Generate / Régénérer button
├── router/
│   ├── index.jsx              # All route definitions (lazy loaded)
│   ├── ProtectedRoute.jsx     # Auth guard (waits for loading)
│   └── RoleRoute.jsx          # Role guard (redirects wrong role)
├── utils/
│   ├── ticketHelpers.js       # formatDate(), formatLabel(), parsePage(), DISPLAY_LABELS map
│   └── formHelpers.js         # mapValidationErrors()
├── App.jsx                    # RouterProvider
├── main.jsx                   # StrictMode + AuthProvider
└── index.css                  # @import "tailwindcss"
```

### Key design decisions
- **Per-domain API files** — each file wraps axios calls, unwraps response
- **AuthContext is the only global state** — everything else is local useState
- **Route guards wait for auth loading** — prevents login flash on refresh
- **401 cleanup in interceptor, routing in React** — strict separation
- **Lazy loading** on all page components with Suspense fallbacks
- **useSearchParams** for ticket filter URL sync (survives refresh)
- **Shared UI components** reused across all pages — no one-off styles
- **DISPLAY_LABELS map** in ticketHelpers.js maps English enum values to French display labels
- **English internal values, French display** — preserved throughout frontend

---

## 4. Features Implemented

### Authentication (Phase 2)
- Login with email/password → token stored in localStorage
- Session restoration via `GET /me` on page load
- Logout with full cleanup (token + user + auth keys)
- Loading spinner during auth restoration

### Routing + Role Guards (Phase 3)
- `/login` → centered login form inside AuthLayout
- `/admin/*` → ProtectedRoute → RoleRoute(admin) → AdminLayout
- `/technician/*` → ProtectedRoute → RoleRoute(technicien) → TechnicianLayout
- `/` → redirects to `/login`
- `*` → 404 page
- Wrong role → redirected to own dashboard

### Admin Dashboard (Phase 5)
- 4 stat cards: total clients, total tickets, pending, resolved
- Recent tickets table with status/priority badges
- Data from `GET /dashboard`

### Client Management (Phase 6)
- Paginated client list with search
- Create, edit, delete with confirmation modal
- 422 validation errors shown per field
- Delete protection (API rejects if client has tickets)

### Ticket List + Filters (Phase 7)
- Admin: filter by status, priority, client, search text
- Technician: filter by status, priority, search (no client filter, no create button)
- Filters synced with URL via `useSearchParams`
- Search debounced at 300ms
- Clickable rows navigate to detail page
- Pagination connected to API response

### Ticket Creation (Phase 8)
- Form: title, description, priority dropdown, searchable client dropdown
- Client search debounced, fetches `GET /clients?search=`
- Submit → `POST /tickets` → redirect to list
- 422 field-level validation errors

### Ticket Detail + Status + Comments + AI (Phase 9)

**Admin TicketDetailPage:**
- View full ticket: title, description, status badge, priority badge, client info, technician, timestamps
- Edit form: title, description, priority (hidden when closed)
- Status transition: only "Clôturer" button (resolved → closed)
- Assign technician: dropdown + button (hidden when closed)
- Add comment: textarea + button (admin can comment on any ticket)
- AI summary: AiSummaryCard + generate/regenerate button

**Technician TicketDetailPage:**
- Same view layout, but no edit form and no assign section
- Status transitions: "Démarrer" (pending → in_progress), "Résoudre" (in_progress → resolved)
- Comment form: only visible if technician is the assigned one
- AI summary: visible and generatable

**Components created:**
- `StatusTransitionButton` — role-aware; admin sees close button, tech sees start/resolve
- `CommentSection` — shows comment list, form shown only if `canComment` prop is true
- `AssignTechnicianSection` — dropdown of technicians, button to assign
- `AiSummaryCard` — displays summary text + suggested category badge
- `GenerateSummaryButton` — "Générer le résumé IA" / "Régénérer le résumé IA"

### Technician Dashboard (Phase 10)
- 3 stat cards: assigned_count, in_progress_count, resolved_count
- Recent assigned tickets table with navigation to ticket detail
- Empty state if no assigned tickets
- Data from `GET /technician/dashboard`

### Polish + Demo Readiness (Phase 11)
- All UI text translated to French (labels, buttons, placeholders, errors, empty states)
- `DISPLAY_LABELS` map centralizes status/priority French labels
- `formatLabel()` reads from map, falls back to title-case
- Admin dashboard bug fixed: `ticket.client?.name` → `ticket.client?.nom`
- `DEMO_CHECKLIST.md` created at project root

---

## 5. Backend — Key Changes and State

### Language / Localization
- `config/app.php`: `locale` → `fr`, `fallback_locale` → `fr`, `faker_locale` → `fr_FR`
- `lang/fr/validation.php`: Full French validation messages + custom field attribute names
  - `nom`, `email` → "adresse e-mail", `telephone`, `priority` → "priorité", `status` → "statut", etc.
- All user-facing backend messages are in French with correct accents

### Enum and Category Values
- `AiSuggestedCategory` PHP enum: `PC`, `Imprimante`, `Réseau`, `Caméra`, `Autre`
- `fromInput()` accepts both accented and unaccented variants (e.g., `Reseau` → `Réseau`)
- Migration `2026_03_29_100000` normalized all stored categories to accented form

### Accent Fixes Applied
- `TicketStatusController`: "déjà", "clôturé", "assigné", "n'est pas assigné à"
- `AiSummaryController`: "Accès interdit", "générer un résumé", "Résumé généré avec succès"

### Demo Data (PfeDemoSeeder)
- **Users:** Nadia El Mansouri (admin), Yassine Berrada (tech1), Salma Oujdi (tech2)
- **Passwords:** `password123` for all
- **Clients:** 8 realistic Moroccan companies
- **Tickets:** 13 total — covers all statuses, priorities, categories, assignment states
  - Statuses: 5 pending, 3 in_progress, 3 resolved, 2 closed
  - Priorities: 2 low, 5 medium, 4 high, 2 urgent
  - Categories: PC, Imprimante, Réseau, Caméra, Autre — all represented
  - 13 tickets → 2 pages visible (pagination threshold is 10/page)
  - 12 have AI summaries, 1 intentionally without (for demo)

---

## 6. Audit — REVIEW_ALL.md

A complete project audit was performed and documented in `REVIEW_ALL.md` (project root).

**Verdict:** Approved with minor fixes required

**Issues found and fixed:**
| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| MAJOR | 3 English spinner texts ("Loading page...", "Checking your access...", "Loading your workspace...") | Translated to French |
| MAJOR | `securiter.md` CAS 2 documented wrong behavior (claimed admin can't comment — admin actually CAN) | Rewrote CAS 2 to test unassigned technicien; added 2 new test cases; fixed French accents |
| MINOR | Redundant role check in `ClientController::destroy()` (route already has `role:admin` middleware) | Removed dead code, fixed indentation |

**Remaining minor items (not blocking, optional):**
- Extract shared helpers (`getApiErrorMessage`, `DetailItem`) duplicated between admin/tech TicketDetailPage
- Extract `TextareaField`, `SelectField` from admin TicketDetailPage to reusable components
- Add automated backend tests (currently only placeholder tests exist)

---

## 7. EN Logic / FR Display Separation

**Rule:** Internal/API values stay English. All user-facing labels are French.

| Type | Internal value | Display label |
|------|---------------|---------------|
| Status | `pending` | En attente |
| Status | `in_progress` | En cours |
| Status | `resolved` | Résolu |
| Status | `closed` | Clôturé |
| Priority | `low` | Faible |
| Priority | `medium` | Moyenne |
| Priority | `high` | Haute |
| Priority | `urgent` | Urgente |

**Category values** (`Réseau`, `Caméra`, etc.) are stored as accented French in DB, displayed as-is.

**Role values** (`admin`, `technicien`) remain consistent between backend and frontend.

---

## 8. Code Quality

**Structure:** Clean. Clear separation between api, context, hooks, layouts, pages, components, router, utils.

**Readability:** High. Functional components, destructured props, consistent naming.

**Patterns consistently applied:**
- Page state: loading → error → empty → content
- Async actions: set loading → clear error → try/catch → finally stop loading
- isMounted cleanup in all useEffect async calls
- Error handling: `error.response?.data?.message || fallback`
- 403 handled with French "Vous n'avez pas accès à cette ressource"
- Refetch after mutations (no optimistic updates)

---

## 9. Security Summary

- Passwords: bcrypt (rounds=12)
- Auth: Sanctum token (24h expiry), Bearer header on all requests
- Rate limiting: login (5/min), AI summary (10/min)
- Role enforcement: middleware (route level) + controller (business logic level)
- No stack traces in API responses
- No SQL injection (Eloquent ORM)
- No XSS (React auto-escapes)
- No mass-assignment vulnerabilities
- CORS: configured for localhost:5173

---

## 10. Demo Accounts and Key Tickets

**Accounts:**
```
Admin:  admin@pfe.test   / password123
Tech1:  tech1@pfe.test   / password123
Tech2:  tech2@pfe.test   / password123
```

**Key tickets for demo:**
- `Wi-Fi instable au service comptabilité` — pending, unassigned (assign live)
- `PC de caisse bloqué au démarrage` — in_progress, tech1
- `Lenteurs sur l'application RH` — resolved (admin can close)
- `Messagerie Outlook indisponible au service achats` — closed (full lifecycle shown)

See `DEMO_CHECKLIST.md` for full 12-step demo walkthrough.

---

## 11. How to Start

1. **Fresh database** from `backend/`:
   ```bash
   php artisan migrate:fresh --seed
   ```

2. **Backend** from `backend/`:
   ```bash
   php artisan serve
   ```

3. **Frontend** from `frontend/`:
   ```bash
   npm run dev
   ```

4. **Reference docs:**
   - `frontend/docs/FRONT_PLAN.md` — phase-by-phase plan
   - `frontend/docs/DESIGN_SYSTEM.md` — visual styling rules
   - `backend/PRD.md` — product requirements
   - `REVIEW_ALL.md` — final audit report
   - `DEMO_CHECKLIST.md` — jury demo walkthrough
   - `CLAUDE.md` — project conventions for AI assistants

---

## Key Backend API Reference

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/login` | No | -- | Login |
| POST | `/api/logout` | Yes | Any | Logout |
| GET | `/api/me` | Yes | Any | Current user |
| GET | `/api/dashboard` | Yes | admin | Admin stats |
| GET | `/api/technician/dashboard` | Yes | technicien | Tech stats |
| GET | `/api/technicians` | Yes | admin | Technician list |
| GET/POST | `/api/clients` | Yes | admin | List / create |
| GET/PUT/DELETE | `/api/clients/{id}` | Yes | admin | Read / update / delete |
| GET/POST | `/api/tickets` | Yes | any | List / create (POST: admin only) |
| GET/PATCH | `/api/tickets/{id}` | Yes | any | Read / update (PATCH: admin only) |
| POST | `/api/tickets/{id}/assign` | Yes | admin | Assign technician |
| PATCH | `/api/tickets/{id}/status` | Yes | any | Status transition |
| POST | `/api/tickets/{id}/comments` | Yes | any | Add comment |
| POST | `/api/tickets/{id}/generate-summary` | Yes | any | AI summary |

**Status flow:** `pending` → `in_progress` → `resolved` → `closed`

**Categories:** `PC`, `Imprimante`, `Réseau`, `Caméra`, `Autre`

**Roles:** `admin`, `technicien`
