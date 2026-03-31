# FRONTEND PLAN

Complete implementation plan for the AI IT Assistant Platform frontend.
Optimized for phased execution with Codex. Each phase is independently reviewable.

---

## 1. Current Repo State

### What already exists
- Vite 8 + React 19 project scaffolded in `frontend/`
- Tailwind CSS 4 with `@tailwindcss/vite` plugin configured in `vite.config.js`
- `react-router-dom` v7 and `axios` installed in `package.json`
- ESLint configured with React hooks and refresh plugins
- `src/` contains Vite boilerplate: `App.jsx`, `App.css`, `index.css`, `main.jsx`, `assets/`

### What is missing
- `index.css` still has Vite default styles — needs `@import "tailwindcss"` instead
- No `.env` file with `VITE_API_URL`
- No Axios instance or API service layer
- No AuthContext or auth hook
- No router configuration or route guards
- No layouts (sidebar, header)
- No pages, components, or hooks folders
- No role-based routing logic

### What must be preserved
- `package.json` dependencies — already correct, do not reinstall
- `vite.config.js` — already configured with Tailwind and port 5173
- `eslint.config.js` — keep as-is

### Risks from current state
- `index.css` must be replaced before any Tailwind classes work
- `App.css` and default `App.jsx` must be replaced — they contain Vite demo content
- `node_modules/` already exists — no `npm install` needed unless adding packages

---

## 2. Frontend Mission

### What the frontend must achieve
A professional, clean, role-based web application that consumes the Laravel API to manage IT support tickets with AI assistance.

### Main goals
1. Authenticate users and maintain session via Bearer token
2. Route users to role-appropriate dashboards (admin vs technicien)
3. Allow admin to manage clients, create/edit tickets, assign technicians
4. Allow technicien to view assigned tickets, update status, add comments
5. Display AI-generated summaries and category suggestions
6. Present a modern, demo-ready UI suitable for a PFE presentation

### MVP scope
- Login / logout
- Admin dashboard with stats
- Client CRUD (admin)
- Ticket list with filters (status, priority, client, search)
- Ticket creation (admin)
- Ticket detail: status transitions, assignment, comments, AI summary
- Technician dashboard with personal stats
- Technician ticket list and detail

### Out-of-scope for now
- Client portal or login
- Real-time notifications / WebSocket
- Dark mode toggle
- Mobile-first responsive (basic responsive is enough)
- Automated testing (unit/e2e)
- Deployment / production build optimization
- i18n / multi-language
- File uploads or attachments

---

## 3. Architecture Decisions

### Chosen stack
| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Build and dev server |
| Tailwind CSS 4 | Utility-first styling |
| React Router v7 | Client-side routing + guards |
| Axios | HTTP client with interceptors |

### Why this stack
- Already installed — no extra setup
- Tailwind enables fast, consistent UI without CSS files per component
- Axios interceptors handle auth token injection and 401 cleanup globally
- React Router v7 supports layout routes for clean nested UI

### Folder structure
```
src/
├── api/
│   ├── axios.js              # Configured Axios instance
│   ├── auth.js               # login(), logout(), getMe()
│   ├── clients.js            # getClients(), createClient(), updateClient(), deleteClient()
│   ├── tickets.js            # getTickets(), getTicket(), createTicket(), updateTicket(), etc.
│   └── dashboard.js          # getAdminDashboard(), getTechnicianDashboard()
├── context/
│   └── AuthContext.jsx        # Auth provider (user, token, login, logout)
├── hooks/
│   └── useAuth.js             # Shortcut to consume AuthContext
├── layouts/
│   ├── AuthLayout.jsx         # Centered layout for login page
│   ├── AdminLayout.jsx        # Sidebar + header for admin pages
│   └── TechnicianLayout.jsx   # Sidebar + header for technician pages
├── pages/
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── ClientsPage.jsx
│   │   ├── ClientCreatePage.jsx
│   │   ├── ClientEditPage.jsx
│   │   ├── TicketsPage.jsx
│   │   ├── TicketCreatePage.jsx
│   │   └── TicketDetailPage.jsx
│   └── technician/
│       ├── DashboardPage.jsx
│       ├── TicketsPage.jsx
│       └── TicketDetailPage.jsx
├── components/
│   ├── ui/                    # Button, Input, Badge, Modal, Spinner, EmptyState, Pagination
│   ├── tickets/               # TicketCard, TicketStatusBadge, TicketFilters, StatusTransitionButton
│   ├── clients/               # ClientForm, ClientRow
│   └── ai/                    # AiSummaryCard, GenerateSummaryButton
├── router/
│   ├── index.jsx              # Route definitions
│   ├── ProtectedRoute.jsx     # Auth guard
│   └── RoleRoute.jsx          # Role guard
├── main.jsx
└── index.css
```

### Separation of concerns
- **api/** — only HTTP logic, no UI
- **context/** — global state (auth only for MVP)
- **hooks/** — reusable stateful logic
- **layouts/** — page wrappers with navigation
- **pages/** — route-level components, each maps to one URL
- **components/** — reusable UI pieces, grouped by domain
- **router/** — routing config and guards, no business logic

### Role of react-best-practices
- No inline component definitions inside other components
- Derive state during render, not in effects
- Use functional setState for stable callbacks
- Use early returns in components for guard clauses
- Keep effects minimal — put interaction logic in event handlers
- Use ternary for conditional rendering, not `&&`

### Role of frontend-designer
- Professional, modern aesthetic — not generic Bootstrap look
- Consistent spacing, color, and typography system via Tailwind
- Purposeful use of cards, badges, and subtle shadows
- Clean data tables with clear hierarchy
- Loading/empty/error states that feel polished, not broken

---

## 4. UI/UX Direction

### Visual style
- Clean, professional, light theme
- Subtle grays for backgrounds (`gray-50`, `gray-100`)
- White cards with light borders and soft shadows
- Accent color: indigo-600 for primary actions and active nav
- Semantic colors for status/priority badges

### Layout philosophy
- Sidebar (fixed left, ~240px) + main content area
- Sidebar: logo/title at top, nav links, logout at bottom
- Main area: page header with title + optional action button, then content
- Login page: centered card on a subtle gradient background

### Admin dashboard look and feel
- 4 stat cards in a row (total clients, total tickets, pending, resolved)
- Recent tickets table below with status badges
- Clean, scannable, no chart clutter for MVP

### Forms
- Stacked labels above inputs
- Full-width inputs with rounded borders
- Clear validation error messages below fields in red
- Submit button at bottom right, cancel on the left

### Tables
- Striped or hover rows for readability
- Column headers in uppercase small text
- Status and priority shown as colored badges
- Clickable rows navigate to detail
- Pagination at bottom

### Cards
- White background, `rounded-lg`, `shadow-sm`, `border border-gray-200`
- Consistent padding `p-6`
- Title + content pattern

### Badges
- Status: pending=yellow, in_progress=blue, resolved=green, closed=gray
- Priority: low=gray, medium=blue, high=orange, urgent=red
- Small pill shape: `rounded-full px-2.5 py-0.5 text-xs font-medium`

### Modals
- Use only when absolutely needed (confirm delete, maybe client form)
- Backdrop overlay with centered white card
- Clear title, content, and action buttons

### Loading / empty / error states
- Loading: centered spinner with subtle text
- Empty: illustration-free, just an icon + message + optional action button
- Error: red-tinted alert box with message from API

### Responsive behavior
- Sidebar collapses on screens < 1024px (hamburger toggle)
- Tables become scrollable horizontally on small screens
- Cards stack vertically on mobile
- Not a priority — desktop-first for demo

### Color logic
- Primary: `indigo-600` (buttons, active nav, links)
- Success: `green-500`/`green-100` (resolved)
- Warning: `yellow-500`/`yellow-100` (pending)
- Info: `blue-500`/`blue-100` (in_progress)
- Danger: `red-500`/`red-100` (urgent, errors, delete)
- Neutral: `gray-500`/`gray-100` (closed, low priority)

### Typography hierarchy
- Page title: `text-2xl font-bold text-gray-900`
- Card title: `text-lg font-semibold text-gray-900`
- Body text: `text-sm text-gray-600`
- Labels: `text-sm font-medium text-gray-700`
- Small/meta: `text-xs text-gray-500`

### Consistency rules
- Every page uses the same layout wrapper
- Every list page has the same filter bar pattern
- Every form follows the same label-above-input pattern
- Every detail page has the same header + sections layout
- Badge styles are defined once in a `ui/Badge.jsx` component

---

## 5. Security and Reliability Rules

### Token handling
- Store token in `localStorage` under key `token`
- Axios request interceptor reads token and sets `Authorization: Bearer <token>`
- On login success, store token immediately before redirect
- On logout, remove token and user from localStorage and context

### 401 handling
- Axios response interceptor catches 401 errors globally
- On 401: clear token, user, and any persisted auth data from localStorage, then reject the promise cleanly
- The interceptor must NOT navigate or redirect — it only cleans up storage
- Redirect to `/login` is handled by AuthContext (detecting missing user) and ProtectedRoute (detecting missing token)
- This separation keeps routing logic inside React, not inside axios

### Logout cleanup rule
- `logout()` must always: clear token, clear user state, clear any persisted auth data from localStorage
- The app must be left in a clean unauthenticated state after logout
- This same cleanup must happen on failed `/me` restoration (expired or invalid token)
- After cleanup, ProtectedRoute will detect missing auth and redirect to `/login`

### 403 handling
- Show a user-friendly message: "Vous n'avez pas accès à cette ressource"
- Do not redirect — let the user navigate away

### Protected routes
- `ProtectedRoute` component wraps all authenticated routes
- Must wait for auth restoration to fully complete before making any decision
- If auth is loading (initial `/me` call in progress): show full-page spinner — never redirect during loading
- If auth finished and no user: redirect to `/login`
- If auth finished and user exists: render children
- This prevents login-page flash and wrong redirects during app boot

### Role routes
- `RoleRoute` component checks `user.role` against allowed roles
- Must also wait for auth loading to be fully resolved before checking role
- If auth loading: show spinner (or rely on ProtectedRoute above)
- If wrong role: redirect to user's own dashboard
- Admin trying to access `/technician/*` → redirect to `/admin/dashboard`
- Technicien trying to access `/admin/*` → redirect to `/technician/dashboard`
- Never redirect based on incomplete or unresolved auth state

### Safe rendering
- Always check data existence before rendering (`data ? ... : null`)
- Never render raw HTML from API
- Never expose token in URL params

### Input validation
- Client-side validation is UX only — backend is the real validator
- Show 422 validation errors from API response below form fields
- Disable submit button while request is in-flight

### API error handling
- All API calls wrapped in try/catch
- Always use safe optional chaining: `error.response?.data?.message || "Une erreur est survenue."`
- Never assume `error.response` or `error.response.data` exists (network errors have neither)
- Fallback to generic French error message
- Never show raw stack traces or axios error objects to user

### Env variable usage
- `VITE_API_URL` is the only env variable
- Never hardcode `http://localhost:8000` anywhere
- Always reference via `import.meta.env.VITE_API_URL`

### Never trusting frontend authorization alone
- Role checks in router and UI are for UX only
- All real security is enforced by backend middleware
- Frontend should gracefully handle unexpected 403 responses

---

## 6. Global Technical Conventions

### Naming conventions
- Components: PascalCase (`TicketCard.jsx`)
- Pages: PascalCase with `Page` suffix (`DashboardPage.jsx`)
- Hooks: camelCase with `use` prefix (`useAuth.js`)
- API service file: camelCase (`axios.js`)
- CSS: Tailwind utility classes only, no custom CSS files per component
- Folders: lowercase (`pages/`, `components/`, `hooks/`)

### File organization
- One component per file
- Group components by domain (`components/tickets/`, `components/clients/`)
- Pages mirror URL structure (`pages/admin/`, `pages/technician/`)
- Shared UI primitives in `components/ui/`

### Component rules
- Functional components only
- Props destructured in function signature
- No inline component definitions inside other components
- Extract static JSX outside components when it doesn't depend on props/state
- Use ternary for conditional rendering, not `&&`

### Hook rules
- Custom hooks only when logic is reused across 2+ components
- Do not create hooks for single-use logic — keep it in the component
- Derive state during render when possible, not in effects

### State management rules
- AuthContext is the only global context for MVP
- All other state is local (component-level useState)
- List data fetched on mount with useEffect, stored in local state
- No Redux, no Zustand, no global state library

### API service rules
- Single Axios instance in `api/axios.js` — all other service files import from it
- Lightweight service files per domain: `api/auth.js`, `api/clients.js`, `api/tickets.js`, `api/dashboard.js`
- Each service file exports simple async functions (e.g., `getClients(params)`, `createTicket(data)`)
- No abstract ApiService class, no repository pattern, no complex generics
- Page components call service functions, not raw axios — this keeps pages clean
- Reusable UI components receive data via props, never call API directly

### Reusability rules
- Create a reusable component only when used 2+ times
- `components/ui/` for truly generic elements (Button, Badge, Input, Modal, Spinner, Pagination)
- Domain components (TicketCard, ClientForm) can be specific

### Performance rules
- Use lazy loading for page components with `React.lazy` + `Suspense`
- Use `key` prop correctly on lists
- Avoid re-creating objects/arrays in render — hoist defaults outside component
- Do not memoize simple primitive expressions

### When to use local state vs context
- Context: auth user + token only
- Local state: everything else (form data, list data, filters, loading, errors)
- If data is only needed in one page, it's local state

### When not to overabstract
- Three similar lines are better than a premature abstraction
- No generic "useApi" hook — call service functions directly
- Service files are allowed and encouraged, but keep them simple: just exported functions, no classes
- No form library — use controlled inputs with useState

### Page state pattern (mandatory for every data page)
Every page that fetches data must follow this consistent rendering flow:
1. If `loading` is true → render `<Spinner />`
2. If `error` is truthy → render `<Alert type="error" message={error} />`
3. If data is empty (empty array, null) → render `<EmptyState message="..." />`
4. Otherwise → render the page content

This pattern must be applied uniformly. No page should skip any of these states.

### Async action pattern (mandatory for every mutation)
Every async action (form submit, status change, assign, delete, generate AI, etc.) must follow this flow:
1. Set loading to true
2. Clear any previous error
3. Try the API request (via service function)
4. On success: update UI or refetch affected data
5. On catch: set error using `error.response?.data?.message || "Une erreur est survenue."`
6. Finally: set loading to false

This prevents inconsistent error handling and forgotten loading states.

### Refetch strategy
- After a mutation (create, update, delete, status change, assign, comment, AI generate), refetch only the affected resource
- For ticket detail: refetch the single ticket via `GET /tickets/{id}` after any action on it
- For list pages: refetch the current list page after create/delete
- Do not reload the full page — just refetch data
- Do not refetch unrelated data (e.g., don't refetch clients list after updating a ticket)

---

## 7. Phase-by-Phase Roadmap

---

### Phase 1: Foundation Setup

**Objective:** Clean boilerplate, configure Tailwind entry, create `.env`, set up Axios instance, create folder structure.

**Why now:** Nothing else can work without this base.

**Files/folders concerned:**
- `src/index.css` — replace with Tailwind import
- `src/App.jsx` — replace with placeholder
- `src/App.css` — delete
- `src/assets/` — delete contents (Vite logos)
- `.env` — create with `VITE_API_URL`
- `src/api/axios.js` — create
- Create empty directories: `context/`, `hooks/`, `layouts/`, `pages/`, `components/ui/`, `router/`

**Exact deliverables:**
1. `index.css` contains only `@import "tailwindcss";`
2. `App.jsx` renders `<h1 className="text-2xl font-bold p-4">AI IT Assistant</h1>`
3. `.env` has `VITE_API_URL=http://localhost:8000/api`
4. `api/axios.js` exports configured instance with:
   - `baseURL` from env
   - Request interceptor attaching Bearer token from localStorage
   - Response interceptor catching 401 → clears token, user, and any persisted auth data from localStorage, then rejects the promise cleanly (NO redirect — routing is handled by React auth layer)
5. All boilerplate files cleaned

**Backend endpoints involved:** None.

**UI components involved:** None.

**Security concerns:**
- Axios interceptor must NOT expose token in logs
- `.env` must be in `.gitignore` (verify)

**Performance concerns:** None.

**Manual verification steps:**
1. `npm run dev` — app loads at localhost:5173
2. Tailwind works: the h1 text is bold and large
3. Browser console: no errors
4. Check axios.js: token interceptor logic is correct by reading the code

**Done criteria:**
- Clean app renders with Tailwind styling
- Axios instance ready with interceptors
- `.env` file exists and is gitignored
- No Vite boilerplate visible

**Common mistakes to avoid:**
- Forgetting `@import "tailwindcss"` in index.css (nothing will style)
- Hardcoding API URL instead of using env variable
- Not checking that `.env` is gitignored

**What Codex must do:**
1. Replace `index.css` content
2. Replace `App.jsx` content
3. Delete `App.css` and `src/assets/` contents
4. Create `.env`
5. Create `src/api/axios.js` with interceptors
6. Create empty folder structure

**What to send back for review:**
- Screenshot of running app
- Content of `api/axios.js`
- Content of `index.css`
- Confirmation that `npm run dev` works

---

### Phase 2: Auth System

**Objective:** Build AuthContext, useAuth hook, LoginPage, and auth restoration on refresh.

**Why now:** Every subsequent page needs to know who the user is and what role they have.

**Files/folders concerned:**
- `src/context/AuthContext.jsx` — create
- `src/hooks/useAuth.js` — create
- `src/pages/LoginPage.jsx` — create
- `src/main.jsx` — wrap App with AuthProvider
- `src/App.jsx` — update to render LoginPage for now

**Exact deliverables:**
1. `AuthContext` provides: `user`, `token`, `login(email, password)`, `logout()`, `loading`
2. `login()` calls `POST /login` (via `api/auth.js`), stores token in localStorage, stores user in state
3. `logout()` calls `POST /logout` (via `api/auth.js`), then always clears token + user from localStorage and state — must leave app in clean unauthenticated state
4. On mount: if token in localStorage, call `GET /me` to restore user; if 401 or any error, clear token + user completely (same cleanup as logout)
5. `loading` must be `true` during initial `/me` restoration — ProtectedRoute and RoleRoute depend on this to avoid premature redirects
6. `useAuth()` hook returns context values
7. `LoginPage` with email/password form, error display, loading state
8. Login form centered on page with clean styling
9. Create `src/api/auth.js` with `login()`, `logout()`, `getMe()` service functions

**Backend endpoints involved:**
- `POST /login` → `{ message, token, data: user }`
- `GET /me` → `{ message, data: user }`
- `POST /logout` → `{ message }`

**UI components involved:**
- LoginPage (standalone, no shared components yet)

**Security concerns:**
- Token stored in localStorage immediately on successful login
- Password field uses `type="password"`
- Error messages from API displayed, not internal errors
- Loading state prevents double-submit

**Performance concerns:**
- Auth restoration (`GET /me`) should show a full-page spinner, not flash the login page

**Manual verification steps:**
1. Open app → see login page
2. Login with valid credentials → token stored in localStorage
3. Refresh page → user restored from `GET /me`, not kicked to login
4. Login with invalid credentials → error message displayed
5. Check localStorage in browser devtools → token present after login

**Done criteria:**
- Login works end-to-end with real backend
- Auth state persists across refresh
- Invalid credentials show API error
- Loading spinner shown during auth restoration

**Common mistakes to avoid:**
- Not awaiting `GET /me` before rendering pages (causes flash to login then back)
- Storing the entire axios response instead of just `response.data.data`
- Not clearing token AND user on failed `GET /me` call (must do full cleanup)
- Login form not disabling button during request
- Putting redirect logic inside axios interceptor instead of React auth layer

**What Codex must do:**
1. Create `src/api/auth.js` with login, logout, me API functions
2. Create AuthContext with login, logout, me restoration
3. Create useAuth hook
4. Create LoginPage with form
5. Wrap App in AuthProvider in main.jsx
6. Temporarily render LoginPage in App.jsx

**What to send back for review:**
- Content of AuthContext.jsx
- Content of LoginPage.jsx
- Screenshot of login page
- Proof that login → localStorage → refresh works

---

### Phase 3: Routing and Layouts

**Objective:** Set up React Router with role-based guards, create admin and technician layouts with sidebar navigation.

**Why now:** After auth works, we need routing to direct users to the right pages.

**Files/folders concerned:**
- `src/router/index.jsx` — create with all route definitions
- `src/router/ProtectedRoute.jsx` — create
- `src/router/RoleRoute.jsx` — create
- `src/layouts/AuthLayout.jsx` — create (centered layout for login)
- `src/layouts/AdminLayout.jsx` — create (sidebar + header + outlet)
- `src/layouts/TechnicianLayout.jsx` — create (sidebar + header + outlet)
- `src/pages/NotFoundPage.jsx` — create
- `src/pages/admin/DashboardPage.jsx` — create placeholder
- `src/pages/technician/DashboardPage.jsx` — create placeholder
- `src/App.jsx` — replace with RouterProvider
- `src/main.jsx` — update if needed

**Exact deliverables:**
1. Route structure:
   - `/login` → LoginPage inside AuthLayout
   - `/admin/*` → ProtectedRoute → RoleRoute(admin) → AdminLayout → nested pages
   - `/technician/*` → ProtectedRoute → RoleRoute(technicien) → TechnicianLayout → nested pages
   - `/` → redirect to `/login`
   - `*` → NotFoundPage
2. ProtectedRoute: must wait for `loading` to be false before any decision. If loading → spinner. If no user after loading → redirect `/login`. If user exists → render children.
3. RoleRoute: must also wait for `loading` to be false. If loading → spinner. If wrong role → redirect to own dashboard. Never redirect on incomplete auth state.
4. AdminLayout: left sidebar with nav links (Dashboard, Clients, Tickets), header with user name, logout button, main content via `<Outlet />`
5. TechnicianLayout: left sidebar with nav links (Dashboard, My Tickets), header, logout, `<Outlet />`
6. Placeholder pages render their title

**Backend endpoints involved:** None directly (auth already handled).

**UI components involved:**
- Sidebar navigation component (can be inline in layouts for now)
- Header bar

**Security concerns:**
- ProtectedRoute must handle the case where token exists but `GET /me` fails
- RoleRoute must not allow URL manipulation to bypass role check
- Logout button must clear everything and redirect

**Performance concerns:**
- Use `React.lazy()` for page components to enable code splitting
- Wrap lazy routes in `<Suspense fallback={<Spinner />}>`

**Manual verification steps:**
1. Login as admin → redirected to `/admin/dashboard` → see sidebar with nav
2. Login as technicien → redirected to `/technician/dashboard` → see tech sidebar
3. As admin, manually type `/technician/dashboard` → redirected to `/admin/dashboard`
4. As technicien, manually type `/admin/clients` → redirected to `/technician/dashboard`
5. Clear localStorage → any protected URL redirects to `/login`
6. Click logout → redirected to `/login`, token gone
7. Visit `/nonexistent` → see 404 page

**Done criteria:**
- All routes resolve correctly
- Role guards work in both directions
- Sidebar navigation renders correct links per role
- Logout works from any page
- Lazy loading works (check network tab for chunk files)

**Common mistakes to avoid:**
- Not using `<Outlet />` in layouts (pages won't render inside layout)
- Putting navigation links for wrong role in layout
- Not handling the loading state in ProtectedRoute (causes flash to login then back)
- Forgetting to redirect `/` to `/login`

**What Codex must do:**
1. Create router/index.jsx with all routes
2. Create ProtectedRoute and RoleRoute guards
3. Create AuthLayout, AdminLayout, TechnicianLayout
4. Create placeholder dashboard pages
5. Create NotFoundPage
6. Update App.jsx and main.jsx

**What to send back for review:**
- Content of router/index.jsx
- Content of ProtectedRoute.jsx
- Screenshot of admin sidebar
- Screenshot of technician sidebar
- Proof that role guard blocks wrong role

---

### Phase 4: Shared UI Components

**Objective:** Build the reusable UI primitives that all pages will use.

**Why now:** Before building any real page, the building blocks must exist to ensure visual consistency.

**Files/folders concerned:**
- `src/components/ui/Button.jsx`
- `src/components/ui/Input.jsx`
- `src/components/ui/Badge.jsx`
- `src/components/ui/Spinner.jsx`
- `src/components/ui/EmptyState.jsx`
- `src/components/ui/Pagination.jsx`
- `src/components/ui/Modal.jsx`
- `src/components/ui/Alert.jsx`

**Exact deliverables:**
1. `Button` — variants: primary (indigo), secondary (gray), danger (red). Props: `variant`, `size`, `disabled`, `loading`, `onClick`, `type`, `children`
2. `Input` — label above, error message below. Props: `label`, `error`, `type`, `...rest` (spread to input)
3. `Badge` — color mapping by variant. Props: `variant` (status or priority values), `children`
4. `Spinner` — centered spinning animation. Props: `size` (sm/md/lg)
5. `EmptyState` — centered message with optional action. Props: `message`, `action`, `onAction`
6. `Pagination` — previous/next + page numbers. Props: `meta` (from API pagination), `onPageChange`
7. `Modal` — overlay + centered card. Props: `open`, `onClose`, `title`, `children`
8. `Alert` — colored box for success/error messages. Props: `type` (success/error/info), `message`, `onClose`

**Backend endpoints involved:** None.

**UI components involved:** All of the above.

**Security concerns:** None.

**Performance concerns:**
- Badge color mapping: use a plain object lookup, not switch/if chains
- Modal: only render when `open` is true

**Manual verification steps:**
1. Create a temporary test page rendering each component with different props
2. Visually verify Button variants, Input with error, Badge colors, Spinner animation
3. Test Modal open/close
4. Test Pagination with mock meta data

**Done criteria:**
- All 8 components render correctly
- Consistent styling matches Section 4 color/typography rules
- Components are self-contained with no external dependencies

**Common mistakes to avoid:**
- Hardcoding colors instead of using the variant prop
- Not spreading `...rest` on Input (breaks things like `placeholder`, `onChange`)
- Modal not closing when clicking backdrop
- Pagination showing wrong page numbers

**What Codex must do:**
1. Create all 8 component files
2. Follow exact Tailwind classes from Section 4
3. Each component must be importable and functional standalone

**What to send back for review:**
- All component file contents
- Screenshot of components rendered together

---

### Phase 5: Admin Dashboard

**Objective:** Build the admin dashboard with stats cards and recent tickets table.

**Why now:** First real data-consuming page. Simple enough to validate the full stack (API call → render).

**Files/folders concerned:**
- `src/pages/admin/DashboardPage.jsx` — replace placeholder

**Exact deliverables:**
1. 4 stat cards in a grid: total clients, total tickets, pending tickets, resolved tickets
2. Recent tickets table (5 rows) with columns: title, client, status, priority, date
3. Status and priority shown as Badge components
4. Loading spinner while fetching
5. Error alert if API call fails

**Backend endpoints involved:**
- `GET /dashboard` → `{ message, data: { total_clients, total_tickets, tickets_by_status, recent_tickets } }`

**UI components involved:**
- Badge (status, priority)
- Spinner
- Alert

**Security concerns:**
- Route already protected by admin guard — no extra checks needed
- Handle potential 403 gracefully if token expires mid-session

**Performance concerns:** Single API call on mount — keep it simple.

**Manual verification steps:**
1. Login as admin → see dashboard with real numbers
2. Numbers match database state (cross-check with Postman)
3. Recent tickets show correct status/priority badges
4. Loading spinner shows briefly before data appears
5. If backend is down → error alert displayed

**Done criteria:**
- Dashboard renders with real data
- Stat cards show correct numbers
- Recent tickets table is readable and styled
- Loading and error states work

**Common mistakes to avoid:**
- Accessing `response.data` instead of `response.data.data` (double data)
- Not handling the case where `recent_tickets` is empty
- Forgetting to show loading state

**What Codex must do:**
1. Replace DashboardPage placeholder with full implementation
2. Call `GET /dashboard` on mount
3. Render stat cards + table with Badge components
4. Handle loading, error, empty states

**What to send back for review:**
- Content of DashboardPage.jsx
- Screenshot with real data

---

### Phase 6: Clients Module

**Objective:** Build client list, create, edit, and delete functionality for admin.

**Why now:** Clients must exist before tickets can reference them.

**Files/folders concerned:**
- `src/pages/admin/ClientsPage.jsx` — create (list + search)
- `src/pages/admin/ClientCreatePage.jsx` — create
- `src/pages/admin/ClientEditPage.jsx` — create
- `src/components/clients/ClientForm.jsx` — create (shared between create/edit)

**Exact deliverables:**
1. ClientsPage: search bar, paginated table (nom, telephone, email, entreprise), create button, edit/delete actions per row
2. Search filters by nom or telephone via `?search=` query param
3. ClientCreatePage: form with fields (nom, telephone, email, adresse, entreprise), submit → redirect to list
4. ClientEditPage: same form pre-filled, submit → redirect to list
5. Delete: confirm modal, show API error if client has tickets
6. Pagination component connected to API meta

**Backend endpoints involved:**
- `GET /clients?search=&page=` → paginated list
- `POST /clients` → create
- `GET /clients/{id}` → single client
- `PUT /clients/{id}` → update
- `DELETE /clients/{id}` → delete (may return 422)

**UI components involved:**
- Input, Button, Badge, Spinner, EmptyState, Pagination, Modal, Alert
- ClientForm (new)

**Security concerns:**
- All routes admin-only (already guarded)
- Show API validation errors (422) on form fields
- Show "cannot delete" error from API clearly

**Performance concerns:** None significant.

**Manual verification steps:**
1. View client list with real data
2. Search by name → list filters
3. Search by phone → list filters
4. Create a new client → appears in list
5. Edit a client → changes saved
6. Delete a client with no tickets → removed
7. Delete a client with tickets → error message shown
8. Pagination works (if > 10 clients)

**Done criteria:**
- Full CRUD works end-to-end
- Search works
- Delete protection works
- Validation errors display under form fields
- Pagination works

**Common mistakes to avoid:**
- Using `PUT` but sending partial data (backend expects all fields for PUT)
- Not refreshing list after create/edit/delete
- Not clearing search when navigating away and back
- Not handling 422 validation errors from API

**What Codex must do:**
1. Create ClientsPage with table, search, pagination
2. Create ClientCreatePage and ClientEditPage using shared ClientForm
3. Create ClientForm component
4. Wire up all CRUD operations with proper error handling

**What to send back for review:**
- All client page files
- ClientForm component
- Screenshot of client list
- Proof that create, edit, delete work

---

### Phase 7: Tickets List and Filters

**Objective:** Build the ticket list page with filter bar for admin, and the simpler version for technician.

**Why now:** Tickets are the core feature. List view must exist before detail view.

**Files/folders concerned:**
- `src/pages/admin/TicketsPage.jsx` — create
- `src/pages/technician/TicketsPage.jsx` — create
- `src/components/tickets/TicketFilters.jsx` — create
- `src/components/tickets/TicketStatusBadge.jsx` — create (or use Badge with mapping)

**Exact deliverables:**
1. Admin TicketsPage: filter bar (status dropdown, priority dropdown, client dropdown, search input), paginated table (title, client, technician, status, priority, date), row click → detail
2. Technician TicketsPage: same table but no client filter, no create button, only assigned tickets
3. TicketFilters: renders appropriate filter controls, emits filter values to parent
4. **Filter URL sync:** Sync filters with URL query params using `useSearchParams()`. Example: `/admin/tickets?status=pending&priority=high&page=2&search=printer`. This allows page refresh persistence and sharable filter URLs. Read initial filter values from URL on mount. Update URL when filters change. Keep implementation simple — no routing library beyond React Router's built-in `useSearchParams`.
4. Status/priority badges using Badge component with correct colors
5. "New Ticket" button on admin page → links to create page

**Backend endpoints involved:**
- `GET /tickets?status=&priority=&client_id=&search=&page=` → paginated list
- `GET /clients` → for client dropdown in admin filters (simple fetch, no pagination needed or use search)

**UI components involved:**
- Badge, Spinner, EmptyState, Pagination, Button, Input
- TicketFilters (new)

**Security concerns:**
- Technician page must not expose client filter or create button
- Backend already scopes technician to assigned tickets — frontend just renders what it gets

**Performance concerns:**
- Debounce search input (300ms) to avoid API spam on every keystroke
- Client dropdown: fetch once on mount, store in local state

**Manual verification steps:**
1. Admin: see all tickets
2. Filter by status → list updates
3. Filter by priority → list updates
4. Search by title → list updates
5. Combine filters → works correctly
6. Pagination works
7. Technician: see only assigned tickets
8. Technician: no client filter, no create button
9. Click a row → navigates to detail (placeholder for now)

**Done criteria:**
- Both ticket list pages render with real data
- All filters work individually and combined
- Pagination works
- Role-appropriate UI differences are visible

**Common mistakes to avoid:**
- Not debouncing search
- Resetting page to 1 when filters change (must do this)
- Fetching clients list on every filter change (fetch once)
- Not showing empty state when no tickets match filters

**What Codex must do:**
1. Create admin TicketsPage with filters + table + pagination
2. Create technician TicketsPage (simpler version)
3. Create TicketFilters component
4. Connect filters to API query params
5. Add navigation link from sidebar and from table rows

**What to send back for review:**
- Content of both TicketsPage files
- Content of TicketFilters
- Screenshot of admin ticket list with filters
- Screenshot of technician ticket list

---

### Phase 8: Ticket Creation

**Objective:** Build the ticket creation page for admin.

**Why now:** Tickets must be creatable before we can test the detail view with fresh data.

**Files/folders concerned:**
- `src/pages/admin/TicketCreatePage.jsx` — create

**Exact deliverables:**
1. Form fields: title, description (textarea), priority (dropdown), client (searchable dropdown)
2. Client dropdown fetches from `GET /clients?search=` with a search input
3. Priority options: low, medium, high, urgent
4. Submit → `POST /tickets` → redirect to ticket list or detail page
5. Show validation errors from API (422)
6. Loading state on submit button

**Backend endpoints involved:**
- `POST /tickets` → `{ message, data: ticket }`
- `GET /clients?search=` → for client selection

**UI components involved:**
- Input, Button, Alert
- Custom select/dropdown for priority and client

**Security concerns:**
- Backend sets `status=pending` and `created_by` automatically — frontend must NOT send these

**Performance concerns:** None.

**Manual verification steps:**
1. Fill all fields → submit → ticket created
2. Leave required field empty → validation error from API
3. Select a client from dropdown → correct client_id sent
4. After creation → redirected and ticket appears in list

**Done criteria:**
- Ticket creation works end-to-end
- Validation errors display correctly
- Client selection works
- Redirect after success

**Common mistakes to avoid:**
- Sending `status` or `created_by` in request body
- Not handling the case where client list is empty
- Not disabling submit during request

**What Codex must do:**
1. Create TicketCreatePage with form
2. Fetch clients for dropdown
3. Handle submit with validation error display
4. Redirect on success

**What to send back for review:**
- Content of TicketCreatePage.jsx
- Screenshot of form
- Proof that ticket creation works

---

### Phase 9: Ticket Detail and Actions

**Objective:** Build the full ticket detail page with status transitions, assignment, comments, and AI summary.

**Why now:** This is the most complex page and the centerpiece of the MVP.

**Files/folders concerned:**
- `src/pages/admin/TicketDetailPage.jsx` — create
- `src/pages/technician/TicketDetailPage.jsx` — create
- `src/components/tickets/StatusTransitionButton.jsx` — create
- `src/components/tickets/CommentSection.jsx` — create
- `src/components/tickets/AssignTechnicianSection.jsx` — create
- `src/components/ai/AiSummaryCard.jsx` — create
- `src/components/ai/GenerateSummaryButton.jsx` — create

**Exact deliverables:**
1. Ticket info card: title, description, status badge, priority badge, client info, technician, created by, dates
2. **Admin ticket edit:** inline edit for title, description, priority (if not closed) via `PATCH /tickets/{id}`
3. **Status transitions:** button showing next allowed status. Logic:
   - pending → "Démarrer" (technicien only)
   - in_progress → "Résoudre" (technicien only)
   - resolved → "Clôturer" (admin only)
   - closed → no button
4. **Assignment section (admin only):** dropdown of technicians from `GET /technicians`, submit assigns via `POST /tickets/{id}/assign`
5. **Comments section:** list of existing comments (author + date + text), add comment form at bottom
6. **AI summary card:** shows summary text + suggested category badge, or "No summary yet"
7. **Generate summary button:** calls `POST /tickets/{id}/generate-summary`, shows loading, updates card on success
8. Technician detail page: same layout but no edit, no assign, status button only for their transitions

**Backend endpoints involved:**
- `GET /tickets/{id}` → full ticket with relations
- `PATCH /tickets/{id}` → update fields (admin)
- `POST /tickets/{id}/status` → change status
- `POST /tickets/{id}/assign` → assign technician
- `POST /tickets/{id}/comments` → add comment
- `POST /tickets/{id}/generate-summary` → AI summary
- `GET /technicians` → for assignment dropdown

**UI components involved:**
- All ui/ components
- StatusTransitionButton, CommentSection, AssignTechnicianSection (new)
- AiSummaryCard, GenerateSummaryButton (new)

**Security concerns:**
- Status transition button must only show allowed transitions for current role
- Assignment section only visible to admin
- Edit fields only visible to admin and only if ticket not closed
- Technician can only comment on their assigned tickets (backend enforces, but hide form for others)

**Performance concerns:**
- Single `GET /tickets/{id}` loads all relations — no extra calls needed for initial render
- After any mutation (status change, comment, assign, AI), refetch only the single ticket via `GET /tickets/{id}` — do not reload the page or refetch unrelated data

**Manual verification steps:**
1. Admin: view ticket detail with all sections
2. Admin: edit title → saved
3. Admin: assign technician → technician name appears
4. Admin: close a resolved ticket → status changes
5. Technicien: view assigned ticket
6. Technicien: change status pending → in_progress → resolved
7. Both: add a comment → appears in list
8. Both: generate AI summary → card shows summary + category
9. Both: regenerate AI summary → replaces old one
10. Closed ticket: no edit, no status button, no assign

**Done criteria:**
- All ticket actions work end-to-end
- Role-specific UI renders correctly
- AI summary generation and display works
- Comments display with author and date
- Status transitions follow PRD rules exactly

**Common mistakes to avoid:**
- Showing status transition button for wrong role
- Not refreshing ticket data after an action
- Allowing edit on closed tickets
- Not handling AI summary loading state (can take seconds)
- Sending wrong status value in transition request

**What Codex must do:**
1. Create both detail pages (admin and technician)
2. Create StatusTransitionButton, CommentSection, AssignTechnicianSection
3. Create AiSummaryCard and GenerateSummaryButton
4. Wire all actions to API calls
5. Refetch ticket after each action

**What to send back for review:**
- All detail page and component file contents
- Screenshot of admin ticket detail
- Screenshot of technician ticket detail
- Proof that status transition, comment, assign, and AI summary work

---

### Phase 10: Technician Dashboard

**Objective:** Build the technician's personal dashboard with their ticket stats.

**Why now:** All ticket infrastructure is built. This is a simple stats page similar to admin dashboard.

**Files/folders concerned:**
- `src/pages/technician/DashboardPage.jsx` — replace placeholder

**Exact deliverables:**
1. Stat cards: assigned count, in_progress count, resolved count
2. Recent assigned tickets table (5 rows) with status/priority badges
3. Loading and error states

**Backend endpoints involved:**
- `GET /technician/dashboard` → `{ message, data: { assigned_count, in_progress_count, resolved_count, recent_assigned } }`

**UI components involved:**
- Badge, Spinner, Alert

**Security concerns:** Route already guarded by technicien role.

**Performance concerns:** Single API call.

**Manual verification steps:**
1. Login as technicien → see dashboard with personal stats
2. Numbers match their assigned tickets
3. Recent tickets show correct data
4. Loading state works

**Done criteria:**
- Dashboard shows real personal data
- Consistent styling with admin dashboard

**Common mistakes to avoid:**
- Using admin dashboard endpoint instead of technician endpoint
- Not handling empty state (new technician with no tickets)

**What Codex must do:**
1. Replace placeholder with full implementation
2. Call `GET /technician/dashboard`
3. Render stat cards + recent tickets table

**What to send back for review:**
- Content of DashboardPage.jsx
- Screenshot with real data

---

### Phase 11: Polish, QA, and Demo Readiness

**Objective:** Fix visual inconsistencies, improve UX details, prepare for demo.

**Why now:** All features are built. This phase is about quality and presentation.

**Files/folders concerned:** All pages and components — review and fix.

**Exact deliverables:**
1. Verify all pages handle loading, error, and empty states consistently
2. Verify all forms show validation errors properly
3. Verify sidebar active link highlights correctly on each page
4. Add page titles (document.title) on each page
5. Verify responsive behavior on 1024px+ screens
6. Test full user workflows: create client → create ticket → assign → technician flow → resolve → close
7. Fix any visual inconsistencies or spacing issues
8. Verify no console errors or warnings

**Backend endpoints involved:** All (integration test).

**Security concerns:** Full flow test — verify no unauthorized access possible via URL manipulation.

**Manual verification steps:**
1. Complete admin workflow: login → create client → create ticket → assign → generate AI summary → close ticket
2. Complete technician workflow: login → view dashboard → view ticket → start → comment → resolve
3. Test role switching: logout admin → login tech → verify different UI
4. Test edge cases: empty data, validation errors (422), expired token (401), long text, rapid clicks, multiple pages of pagination
5. No console errors in any flow

**Done criteria:**
- All workflows complete without errors
- UI is consistent and professional
- Demo-ready

**Common mistakes to avoid:**
- Skipping edge case testing (empty data, validation errors, expired token, long text, pagination)
- Leaving console.log statements
- Not testing with fresh/empty database

**What Codex must do:**
1. Review all pages for consistency
2. Fix any issues found
3. Add missing loading/error states
4. Clean up console warnings

**What to send back for review:**
- Screenshots of complete admin workflow
- Screenshots of complete technician workflow
- Confirmation of zero console errors

---

## 8. Detailed Codex Execution Instructions

### General rules for every phase

**Before coding:**
1. Read FRONT_PLAN.md for the phase you're implementing
2. Read CLAUDE.md for project-wide rules
3. Inspect any existing files that will be modified
4. Verify backend is running (`php artisan serve` in backend/)

**During coding:**
1. Create files one at a time
2. Follow the exact folder structure from Section 3
3. Use Tailwind classes from Section 4 — no custom CSS
4. Use API service files (`api/auth.js`, `api/clients.js`, etc.) for API calls — not raw axios in pages
5. Use `useAuth()` for user/role info
6. Follow the page state pattern on every data page: loading → error → empty → content
7. Follow the async action pattern on every mutation: loading → clear error → try → catch → finally
8. Use safe error access: `error.response?.data?.message || "Une erreur est survenue."`
9. Use the shared ui/ components — do not recreate buttons/badges inline

**After coding:**
1. Run `npm run dev` and verify the page works
2. Check browser console for errors
3. Test with real backend data
4. Compare against the "done criteria" for the phase

**What NOT to do:**
- Do not install new packages without explicit instruction
- Do not create utility files or helper functions unless specified
- Do not add comments explaining obvious code
- Do not create test files (out of scope for MVP)
- Do not modify backend code
- Do not modify files from previous phases unless fixing a bug
- Do not add dark mode, animations, or transitions unless specified
- Do not create an abstract "ApiService" class — use simple service files with exported functions
- Do not put redirect/navigation logic inside axios interceptors — routing stays in React

### Phase-specific approach

**Phase 1:** Pure cleanup and setup. No API calls. Just file operations.

**Phase 2:** Focus on AuthContext logic. Test login flow manually. Verify token persistence.

**Phase 3:** Focus on router configuration. Test every route path manually. Verify guards block correctly.

**Phase 4:** Build components in isolation. Each must work with just props. No API calls in components.

**Phase 5-10:** For each data page:
1. Create/update the relevant API service file first (e.g., `api/dashboard.js`)
2. Start with the API call in a `useEffect` using the service function
3. Store response in `useState`
4. Follow the page state pattern: loading → spinner, error → alert, empty → empty state, data → render
5. Use shared components for badges, buttons, pagination
6. Wire up actions following the async action pattern: set loading → clear error → try service call → catch with safe error access → finally stop loading
7. After mutations, refetch only the affected resource

---

## 9. Recommended Final Folder Structure

```
frontend/
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── api/
    │   ├── axios.js
    │   ├── auth.js
    │   ├── clients.js
    │   ├── tickets.js
    │   └── dashboard.js
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   └── useAuth.js
    ├── router/
    │   ├── index.jsx
    │   ├── ProtectedRoute.jsx
    │   └── RoleRoute.jsx
    ├── layouts/
    │   ├── AuthLayout.jsx
    │   ├── AdminLayout.jsx
    │   └── TechnicianLayout.jsx
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── admin/
    │   │   ├── DashboardPage.jsx
    │   │   ├── ClientsPage.jsx
    │   │   ├── ClientCreatePage.jsx
    │   │   ├── ClientEditPage.jsx
    │   │   ├── TicketsPage.jsx
    │   │   ├── TicketCreatePage.jsx
    │   │   └── TicketDetailPage.jsx
    │   └── technician/
    │       ├── DashboardPage.jsx
    │       ├── TicketsPage.jsx
    │       └── TicketDetailPage.jsx
    └── components/
        ├── ui/
        │   ├── Button.jsx
        │   ├── Input.jsx
        │   ├── Badge.jsx
        │   ├── Spinner.jsx
        │   ├── EmptyState.jsx
        │   ├── Pagination.jsx
        │   ├── Modal.jsx
        │   └── Alert.jsx
        ├── tickets/
        │   ├── TicketFilters.jsx
        │   ├── StatusTransitionButton.jsx
        │   ├── CommentSection.jsx
        │   └── AssignTechnicianSection.jsx
        ├── clients/
        │   └── ClientForm.jsx
        └── ai/
            ├── AiSummaryCard.jsx
            └── GenerateSummaryButton.jsx
```

---

## 10. Final Notes for Execution

### Execution order
Follow phases 1 → 11 strictly. Do not skip phases. Do not combine phases.

### Discipline rules
- One phase per Codex session
- Review after each phase before proceeding
- If a phase introduces a bug from a previous phase, fix it before moving on
- Do not gold-plate — build exactly what the phase specifies

### Testing edge cases
Verify pages not only with normal data, but also: empty data, validation errors, expired token, long text, and multiple pages of pagination. These must be tested in every phase where a page or form is built, not only in Phase 11.

### How to avoid context bloat
- Each Codex session should reference only: FRONT_PLAN.md (the current phase), CLAUDE.md, and the specific files being created/modified
- Do not send the entire plan for every phase — only the relevant phase section
- Do not re-read backend code unless debugging an API issue

### When to use plan mode
- Before Phase 1: plan is already written (this document)
- During execution: no plan mode needed, just implement
- If a phase requires significant deviation: pause, update FRONT_PLAN.md, then continue

### When implementation can start
- After this plan is reviewed and approved
- After verifying backend is running and seeded with demo data
- After verifying `npm run dev` works in frontend/

### What must always be verified before moving to next phase
1. `npm run dev` runs without errors
2. Browser console has no errors
3. The phase's "done criteria" are all met
4. The phase's "manual verification steps" all pass

---

## Recommended Next Action

**After this plan is approved:**

Start Phase 1 with Codex. The exact instruction to give Codex:

> Implement Phase 1 from FRONT_PLAN.md: Clean Vite boilerplate, replace index.css with Tailwind import, create .env with VITE_API_URL, create src/api/axios.js with Bearer token interceptor (request: attach token, response: 401 clears token+user from localStorage only — NO redirect), create src/api/auth.js with login/logout/me functions, create empty folder structure (context/, hooks/, layouts/, pages/admin/, pages/technician/, components/ui/, components/tickets/, components/clients/, components/ai/, router/). Delete App.css and assets/. Replace App.jsx with a simple Tailwind test heading. Verify with npm run dev.
