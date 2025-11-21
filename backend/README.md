# Service Helpdesk CRM - Backend

This README describes how to set up and use the backend API for the Service Helpdesk CRM Helpdesk application.

## Quick start

1. Create a `.env` file in the `backend/` folder with the following minimum variables:

```
MONGODB_URI=mongodb://localhost:27017/proxima_crm
JWT_SECRET=change_this_to_a_strong_secret
PORT=5000
```

2. Install dependencies and run the server:

```bash
cd backend
npm install
# development (auto-reloads with nodemon)
npm run dev
# or production
npm start
```

3. Use the Register endpoint to create the first user (preferably `admin`). Note: the `email` field is required and must be unique.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123","role":"admin"}'
```

4. Login to obtain a JWT:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

Response example:

```json
{
  "token": "<JWT_TOKEN>",
  "username": "admin",
  "role": "admin"
}
```

Include this token in `Authorization: Bearer <JWT_TOKEN>` for protected endpoints.

---

## API Endpoints

All endpoints are mounted under `/api`.

- `POST /api/auth/register` — Register new user

  - Body: `{ username, email, password, role }` (role optional, one of `admin|agent|user`).
  - `email` is required and must be unique across users.

- `POST /api/auth/login` — Log in

  - Body: `{ username, password }`

- `GET /api/tickets` — List tickets (protected)

  - Query params supported:
    - `search` — text search over title and description (case-insensitive substring)
    - `status` — filter by status (`Open`, `In Progress`, `Resolved`)
    - `priority` — filter by priority (`Low`, `Medium`, `High`)
    - `assignedAgent` — filter by agent id
    - `page`, `limit` — pagination
  - Behavior: Admin sees all tickets; Agents see assigned or unassigned tickets; Users see their own tickets.

  - Query parameter validation:

    - `search` : optional string (max 200 chars)
    - `status` : optional enum (`Open`, `In Progress`, `Resolved`)
    - `priority` : optional enum (`Low`, `Medium`, `High`)
    - `assignedAgent` : optional MongoDB ObjectId
    - `page` : optional integer (defaults to 1)
    - `limit` : optional integer (defaults to 10, max 100)

  - Example request:

    ```bash
    curl -X GET 'http://localhost:5000/api/tickets?search=login&status=Open&page=1&limit=10' \
      -H "Authorization: Bearer <JWT_TOKEN>"
    ```

  - Example response:

    ```json
    {
      "tickets": [
        /* array of ticket objects */
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 123,
        "pages": 13
      }
    }
    ```

- `POST /api/tickets` — Create ticket (protected)

  - Body: `{ title, description, priority, status }` (assignedAgent is NOT accepted here)
  - The ticket's `createdBy` is set from the authenticated user.

- `PUT /api/tickets/:id` — Update ticket (protected)

  - Body may include: `{ title, description, status, priority }` only. `assignedAgent` is deliberately excluded.
  - Authorization: Admin OR agent assigned to the ticket OR ticket creator.

- `PUT /api/tickets/:id/assign` — Assign ticket to agent (protected)

  - Body: `{ agentId }` where `agentId` is a MongoDB ObjectId of a user with role `agent`.
  - Authorization: `admin` or `agent` (depending on your policy). This endpoint validates the target is actually an `agent`.

- `GET /api/tickets/:id/activity` — Get activity log for a ticket (protected)

- `GET /api/users/agents` — List agents (protected: admin/agent)

- `GET /api/users` — List users (protected: admin)

  - Query params: `role`, `page`, `limit`

- `PUT /api/users/:id/role` — Update user role (protected: admin)

  - Body: `{ role }` (`admin|agent|user`)

- `GET /api/activity-logs` — List activity logs (protected: admin)
  - Query params: `page`, `limit`

### DELETE endpoints

The API exposes a protected delete endpoint for tickets:

- `DELETE /api/tickets/:id` — Delete a ticket (protected)

  - Protected: requires a valid JWT in the `Authorization: Bearer <token>` header.
  - Authorization: only users with role `admin` or the original ticket creator may delete a ticket.
  - Response shape on success: `{ "message": "Ticket deleted successfully", "ticket": <Ticket> }` where `<Ticket>` is the deleted ticket object as returned by the server.
  - Possible error responses:

    - `401 Unauthorized` — when no valid JWT is provided.
    - `403 Forbidden` — when the authenticated user is not authorized to delete the ticket.
    - `404 Not Found` — when the specified ticket id does not exist.

  - Example request:

    ```bash
    curl -X DELETE http://localhost:5000/api/tickets/<TICKET_ID> \
      -H "Authorization: Bearer <JWT_TOKEN>"
    ```

  This endpoint is implemented in `routes/tickets.js` and handled by `controllers/ticketController.js`.

---

## Examples

Create a ticket (replace `<JWT_TOKEN>`):

```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"title":"Printer issue","description":"Printer not working","priority":"High"}'
```

Assign a ticket to an agent:

```bash
curl -X PUT http://localhost:5000/api/tickets/<TICKET_ID>/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"agentId":"<AGENT_ID>"}'
```

Get activity logs for a ticket:

```bash
curl -X GET http://localhost:5000/api/tickets/<TICKET_ID>/activity \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Notification service (mock)

There is a `services/notificationService.js` placeholder which logs notification events to the console and provides lightweight utilities for testing.

- The mock service logs email and SMS messages to the server console.
- It also stores an in-memory `_notificationLog` and exposes `getNotificationLog()` for inspection (useful in development or automated tests).
- Triggers include: ticket status change, ticket assignment, ticket creation, ticket deletion.

Example usage (curl-like):

```bash
curl -X PUT http://localhost:5000/api/tickets/<TICKET_ID>/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"agentId":"<AGENT_ID>"}'
```

You can inspect notification activity in server logs or programmatically with `NotificationService.getNotificationLog()`.

## Troubleshooting

- 403 Forbidden during registration/login: ensure you are calling `/api/auth/*` (not `/`) and that no other service (e.g. macOS AirPlay on port 5000) is intercepting the request. If another process binds port 5000, run backend on another port: `PORT=5001 npm start`.
- 500 / DB errors: ensure `MONGODB_URI` is correct and the DB is reachable.
- 401 Unauthorized: ensure JWT token is included as `Authorization: Bearer <token>`.

If you want, I can add a `scripts/seedAdmin.js` to auto-create an admin user at startup when the user collection is empty.

---

If you want an OpenAPI/Swagger spec generated for these endpoints, I can add it.

Note on pagination semantics:

- For any API endpoint that returns pagination metadata (e.g., `pagination` with `page`, `limit`, `total`, `pages`), the `pages` value is normalized to be at least `1` to provide consistent semantics for clients. When `total` is `0`, `pages` will be `1`.

## Activity Logging

All CRUD operations related to tickets are logged by the `activityLogger` middleware. You can retrieve logs per-ticket via:

```bash
curl -X GET http://localhost:5000/api/tickets/<TICKET_ID>/activity \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Example activity log entry:

```json
{
  "_id": "...",
  "user": { "_id": "...", "username": "admin" },
  "action": "CREATE",
  "entityType": "Ticket",
  "entityId": "<TICKET_ID>",
  "changes": {
    /* optional */
  },
  "metadata": { "ip": "::1" },
  "timestamp": "2025-11-19T..."
}
```
