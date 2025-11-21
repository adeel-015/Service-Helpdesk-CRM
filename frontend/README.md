# Service Helpdesk CRM - Frontend

This README explains how to run the React frontend and how it interacts with the backend API.

## Quick start

1. Ensure the backend API is running and reachable (see `backend/README.md`). The frontend expects the API at `http://localhost:5000/api` by default.

2. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

3. Open `http://localhost:3000` in your browser.

## Configure API URL

Open `frontend/src/App.jsx` and edit the `API_URL` constant at the top if your backend runs on a different host or port:

```js
const API_URL = "http://localhost:5000/api";
```

If you run the backend on a different port (e.g. `5001`) because `5000` is in use, update `API_URL` accordingly: `http://localhost:5001/api`.

## Usage

- Login: Use the credentials you created via the backend `POST /api/auth/login`. The frontend's login form calls the `/auth/login` endpoint and expects `{ token, username, role }` in response.
- Dashboard: After login you'll see an overview with stats and a ticket list.
- New Ticket: Click `New Ticket` to create a ticket. The frontend POSTs to `/api/tickets` and requires an Authorization header.
- Assignment & Status Changes: Admins can change ticket status and assign agents via the dashboard. These actions map to `/api/tickets/:id` (update) and `/api/tickets/:id/assign` (assign).
- Activity Logs: Ticket detail view fetches `/api/tickets/:id/activity` for history.

## Common issues ("load failed")

If the app shows "load failed" when trying to log in or load data, try the following:

1. Confirm backend is running and reachable at the configured `API_URL`. Try the login curl command from the backend README.
2. Open browser DevTools → Network tab and inspect the failing request — check status code and response body (server error, CORS, 404, 403, etc.).
3. If status is 403 and the response `Server` header mentions `AirPlay` or similar, your request is hitting another macOS service on the same port — see backend README for instructions to run backend on a different port.
4. Confirm `Authorization` header is present and uses `Bearer <token>` where required.
5. If the frontend is using mocked preview (checks window.location.hostname), disable that behavior or run with a real backend.

## Features mapping (where to look in code)

- `frontend/src/App.jsx` — main app and state management (simple auth + ticket loading)
- `frontend/src/index.css` — global styles (Tailwind directives may be used if installed)
- Components (to be created / already present):
  - `src/components/auth/LoginForm.jsx` — login form
  - `src/components/dashboard/Sidebar.jsx`, `StatsCards.jsx`, `TicketTable.jsx`
  - `src/components/tickets/TicketForm.jsx`, `TicketFilters.jsx`, `TicketDetails.jsx`
  - `src/components/common/StatusBadge.jsx`, `PriorityBadge.jsx`, `Modal.jsx`

If you need, I can extract the current monolithic `App.jsx` into these components and wire React Router, contexts, and other improvements.

## Troubleshooting & Next steps

- If you want automatic seeding of an admin user on first run, I can add a backend startup script.
- If you want the frontend to persist login across reloads, I can add `localStorage` support for the token and a small `AuthContext`.
- I can also generate a Postman collection for all API endpoints to make manual testing easier.

---

If you'd like, I can now:

- add the `seedAdmin` script and a CLI to run it;
- extract `App.jsx` into components and add React Router + protected routes;
- add Tailwind/PostCSS setup and scaffold the components listed above.

Tell me which one you'd like next.
