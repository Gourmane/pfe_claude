# CLAUDE.md

This file provides guidance to Claude Code when working on this repository.

## Project Overview

This project is a PFE MVP: an AI-powered IT Support Ticket Management System.

Architecture:
- Laravel 12 REST API backend
- React frontend (to be implemented)
- MySQL database preferred for real project usage
- Tailwind CSS for frontend styling
- Sanctum token authentication
- Groq AI integration for summarization and category suggestion, with local fallback

Main goal:
Build a secure, clean, professional MVP that is realistic, easy to demo, and aligned with the PRD.

---

## Repository Structure

- `backend/` — Laravel API application
- `frontend/` — React application
- `backend/PRD.md` — product requirements document

---

## Core Business Rules

These rules are mandatory and must stay consistent across backend, frontend, database, and AI logic.

### Roles
- `admin`
- `technicien`

A user has only one role.

### MVP Scope
- No client login in V1
- Admin creates and manages clients
- Admin creates tickets
- Admin can assign tickets to a technicien
- Technicien handles assigned tickets
- Technicien can update ticket progress and add comments
- AI can summarize and suggest a category

### Ticket Categories
Use exactly these values everywhere:
- `PC`
- `Imprimante`
- `Réseau`
- `Caméra`
- `Autre`

Never use unaccented variants like `Reseau` or `Camera`.

### Ticket Status Flow
Allowed flow:
- `pending` → `in_progress`
- `in_progress` → `resolved`
- `resolved` → `closed`

Do not allow invalid transitions.

### Data Integrity Rules
- `created_by` must reference `users.id`
- `technician_id` must be nullable until assignment
- A client that already has tickets cannot be deleted
- All foreign keys, validation rules, and enums must stay consistent with the PRD

---

## Security Rules

Security is a top priority.

When generating code, always:
- protect sensitive routes with `auth:sanctum`
- enforce role checks with middleware
- validate all request inputs
- never trust frontend input
- avoid mass-assignment issues
- keep business rules enforced in backend, not only frontend
- throttle login routes
- return safe JSON errors
- avoid exposing stack traces or sensitive internal details
- follow least-privilege access

Do not generate insecure shortcuts just to make features work faster.

---

## Backend Conventions

### Architecture
Preferred flow:
`Route → Middleware → Controller → Service (if needed) → Model → JSON Response`

### Backend Principles
- Keep controllers clean
- Put AI/external logic in services
- Use Eloquent relationships properly
- Use eager loading when needed
- Keep naming consistent
- Respect PRD field names and business vocabulary
- Prefer explicit validation and explicit authorization

### Responses
- JSON responses should be clear and consistent
- Usually include:
  - `message`
  - `data` or resource payload
- Use appropriate HTTP status codes

### Testing
When adding or editing backend features:
- explain what changed
- provide how to test in Postman
- provide expected request body
- provide expected response
- mention possible edge cases

---

## Frontend Conventions

Frontend stack:
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Frontend Principles
- Build a professional, modern, clean UI
- Focus on clarity and usability
- Separate pages, components, services, and layouts properly
- Use reusable components
- Keep API calls centralized
- Protect authenticated pages
- Handle loading, error, and empty states
- Keep role-based UI behavior consistent with backend permissions

### Main Frontend Screens
- Login
- Admin dashboard
- Client management
- Ticket list
- Ticket details
- Ticket creation
- Ticket assignment
- Technician dashboard
- Comments/history view

---

## How Claude Should Work

When helping in this repository, always follow this method:

1. First explain the task simply
2. Then propose the clean approach
3. Then generate the code
4. Then explain where each file goes
5. Then explain how to test it
6. Then mention security checks or business-rule checks

Do not make large destructive changes without warning.
Do not invent features outside the MVP unless explicitly requested.
Always stay aligned with the PRD.

---

## Commands

All backend commands run from `backend/`:

```bash
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
npm run dev
php artisan test
./vendor/bin/pint
```

All frontend commands run from `frontend/`:

```bash
npm install
npm run dev
npm run build
```
