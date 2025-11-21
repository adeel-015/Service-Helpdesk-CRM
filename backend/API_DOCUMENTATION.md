# Service Helpdesk CRM - API Documentation

Base URL: `http://localhost:5001/api`

## Table of Contents

- [Authentication](#authentication)
- [Tickets](#tickets)
- [Users](#users)
- [Activity Logs](#activity-logs)
- [Error Handling](#error-handling)

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "username": "string (required, unique, 3-30 chars)",
  "password": "string (required, min 6 chars)",
  "role": "string (required, enum: ['user', 'agent', 'admin'])"
}
```

**Success Response (200):**

```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**

- `400` - Validation error (username exists, invalid data)
- `500` - Server error

**Example:**

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!",
    "role": "user"
  }'
```

---

### Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "role": "user"
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Invalid credentials
- `404` - User not found

**Token Expiration:** 1 hour

**Example:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

---

## Tickets

All ticket endpoints require authentication. Include JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Get All Tickets

Retrieve tickets with optional filtering and pagination.

**Endpoint:** `GET /tickets`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `search` | string | Search in title and description | - |
| `status` | string | Filter by status (Open, In Progress, Resolved) | - |
| `priority` | string | Filter by priority (Low, Medium, High) | - |
| `assignedAgent` | string | Filter by agent ID | - |
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |

**Access Control:**

- **Admin/Agent**: View all tickets
- **User**: View only own tickets

**Success Response (200):**

```json
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Cannot login",
      "description": "Login button not working",
      "status": "Open",
      "priority": "High",
      "createdBy": "john_doe",
      "assignedAgent": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

**Example:**

```bash
curl -X GET "http://localhost:5001/api/tickets?status=Open&priority=High&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Create Ticket

Create a new support ticket.

**Endpoint:** `POST /tickets`

**Request Body:**

```json
{
  "title": "string (required, 5-200 chars)",
  "description": "string (required, 10-2000 chars)",
  "priority": "string (optional, enum: ['Low', 'Medium', 'High'], default: 'Medium')"
}
```

**Success Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Cannot access dashboard",
  "description": "Getting 404 error when trying to access the dashboard",
  "status": "Open",
  "priority": "Medium",
  "createdBy": "john_doe",
  "assignedAgent": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Notifications Sent:**

- Email/SMS to admins
- Notification to available agents

**Activity Logged:** Yes (CREATE)

**Example:**

```bash
curl -X POST http://localhost:5001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "App crashes on startup",
    "description": "The application crashes immediately after launching on iOS 15",
    "priority": "High"
  }'
```

---

### Update Ticket

Update an existing ticket.

**Endpoint:** `PUT /tickets/:id`

**URL Parameters:**

- `id` - Ticket ID (MongoDB ObjectId)

**Request Body:** (All fields optional)

```json
{
  "title": "string (5-200 chars)",
  "description": "string (10-2000 chars)",
  "status": "string (enum: ['Open', 'In Progress', 'Resolved'])",
  "priority": "string (enum: ['Low', 'Medium', 'High'])"
}
```

**Access Control:**

- **User**: Can update own tickets
- **Agent/Admin**: Can update any ticket

**Success Response (200):**

```json
{
  "message": "Ticket updated successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "status": "In Progress",
    "priority": "High",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Notifications Sent:**

- Status change: Notify ticket creator
- Assignment change: Notify assigned agent

**Activity Logged:** Yes (UPDATE)

**Example:**

```bash
curl -X PUT http://localhost:5001/api/tickets/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "In Progress",
    "priority": "High"
  }'
```

---

### Assign Ticket to Agent

Assign a ticket to an agent.

**Endpoint:** `PUT /tickets/:id/assign`

**Access Control:** Admin and Agent only

**Request Body:**

```json
{
  "agentId": "string (required, MongoDB ObjectId)"
}
```

**Success Response (200):**

```json
{
  "message": "Ticket assigned successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "assignedAgent": {
      "_id": "507f1f77bcf86cd799439022",
      "username": "agent_smith"
    }
  }
}
```

**Notifications Sent:**

- Email/SMS to assigned agent

**Activity Logged:** Yes (ASSIGN)

**Example:**

```bash
curl -X PUT http://localhost:5001/api/tickets/507f1f77bcf86cd799439011/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"agentId": "507f1f77bcf86cd799439022"}'
```

---

### Delete Ticket

Delete a ticket permanently.

**Endpoint:** `DELETE /tickets/:id`

**Access Control:**

- **User**: Can delete own tickets
- **Admin**: Can delete any ticket
- **Agent**: Cannot delete tickets

**Success Response (200):**

```json
{
  "message": "Ticket deleted successfully"
}
```

**Notifications Sent:**

- Notification to admins

**Activity Logged:** Yes (DELETE)

**Example:**

```bash
curl -X DELETE http://localhost:5001/api/tickets/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get Ticket Activity Logs

Retrieve activity history for a specific ticket.

**Endpoint:** `GET /tickets/:id/activity`

**Success Response (200):**

```json
{
  "activities": [
    {
      "_id": "507f1f77bcf86cd799439033",
      "user": {
        "_id": "507f1f77bcf86cd799439022",
        "username": "agent_smith"
      },
      "action": "ASSIGN",
      "entityType": "Ticket",
      "entityId": "507f1f77bcf86cd799439011",
      "changes": {
        "assignedAgent": "507f1f77bcf86cd799439022"
      },
      "timestamp": "2024-01-15T11:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439034",
      "user": {
        "_id": "507f1f77bcf86cd799439022",
        "username": "agent_smith"
      },
      "action": "UPDATE",
      "entityType": "Ticket",
      "entityId": "507f1f77bcf86cd799439011",
      "changes": {
        "status": "In Progress"
      },
      "timestamp": "2024-01-15T11:30:00.000Z"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:5001/api/tickets/507f1f77bcf86cd799439011/activity \
  -H "Authorization: Bearer $TOKEN"
```

---

## Users

### Get All Agents

Retrieve list of all agents.

**Endpoint:** `GET /users/agents`

**Access Control:** Admin and Agent only

**Success Response (200):**

```json
{
  "agents": [
    {
      "_id": "507f1f77bcf86cd799439022",
      "username": "agent_smith",
      "role": "agent"
    },
    {
      "_id": "507f1f77bcf86cd799439023",
      "username": "agent_jones",
      "role": "agent"
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:5001/api/users/agents \
  -H "Authorization: Bearer $TOKEN"
```

---

### Get All Users

Retrieve all users with pagination.

**Endpoint:** `GET /users`

**Access Control:** Admin only

**Query Parameters:**
| Parameter | Type | Default |
|-----------|------|---------|
| `page` | number | 1 |
| `limit` | number | 10 |

**Success Response (200):**

```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439022",
      "username": "john_doe",
      "role": "user"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

**Example:**

```bash
curl -X GET "http://localhost:5001/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Update User Role

Change a user's role.

**Endpoint:** `PUT /users/:id/role`

**Access Control:** Admin only

**Request Body:**

```json
{
  "role": "string (required, enum: ['user', 'agent', 'admin'])"
}
```

**Success Response (200):**

```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439022",
    "username": "john_doe",
    "role": "agent"
  }
}
```

**Example:**

```bash
curl -X PUT http://localhost:5001/api/users/507f1f77bcf86cd799439022/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"role": "agent"}'
```

---

## Activity Logs

### Get All Activity Logs

Retrieve system-wide activity logs.

**Endpoint:** `GET /activity-logs`

**Access Control:** Admin only

**Query Parameters:**
| Parameter | Type | Default |
|-----------|------|---------|
| `page` | number | 1 |
| `limit` | number | 50 |

**Success Response (200):**

```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439033",
      "user": {
        "_id": "507f1f77bcf86cd799439022",
        "username": "john_doe"
      },
      "action": "CREATE",
      "entityType": "Ticket",
      "entityId": "507f1f77bcf86cd799439011",
      "changes": {
        "title": "New ticket",
        "status": "Open"
      },
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 150
}
```

**Action Types:**

- `CREATE` - Entity created
- `UPDATE` - Entity updated
- `DELETE` - Entity deleted
- `ASSIGN` - Ticket assigned

**Example:**

```bash
curl -X GET "http://localhost:5001/api/activity-logs?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Handling

All endpoints return consistent error responses:

### 400 Bad Request

Validation errors or invalid input.

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 5 characters"
    },
    {
      "field": "priority",
      "message": "Priority must be Low, Medium, or High"
    }
  ]
}
```

### 401 Unauthorized

Missing or invalid authentication token.

```json
{
  "message": "No token provided"
}
```

or

```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden

Insufficient permissions for the requested action.

```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found

Requested resource not found.

```json
{
  "message": "Ticket not found"
}
```

### 500 Internal Server Error

Server-side error.

```json
{
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

---

## Response Headers

All responses include:

```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

---

## Data Models

### User

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'agent', 'admin'], default: 'user')
}
```

### Ticket

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  status: String (enum: ['Open', 'In Progress', 'Resolved'], default: 'Open'),
  priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
  createdBy: String (required),
  assignedAgent: ObjectId (ref: User, nullable),
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Log

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  action: String (enum: ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN'], required),
  entityType: String (required),
  entityId: String (required),
  changes: Object,
  timestamp: Date
}
```

---

## Testing the API

### Using curl

Save your token:

```bash
TOKEN="your-jwt-token-here"
```

### Using Postman

1. Create environment with:

   - `base_url`: `http://localhost:5001/api`
   - `token`: (set after login)

2. For authenticated requests, add header:
   ```
   Authorization: Bearer {{token}}
   ```

### Using JavaScript (fetch)

```javascript
const API_URL = "http://localhost:5001/api";
let token = localStorage.getItem("token");

async function createTicket(data) {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- MongoDB ObjectIds are 24-character hex strings
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 1 hour
- Search is case-insensitive
- Pagination defaults: page=1, limit=10
