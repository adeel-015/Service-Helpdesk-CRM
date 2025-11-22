# Service Helpdesk CRM - Helpdesk Ticketing System

A full-stack customer relationship management and helpdesk ticketing system built with the MERN stack (MongoDB, Express.js, React, Node.js) following OOP principles and modular architecture.

## 🚀 Features

### Backend Features

- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT-based authentication** and authorization
- **Role-based access control** (Admin, Agent, User)
- **Ticket management** with CRUD operations
- **Advanced search and filtering** (by title, description, status, priority, assigned agent)
- **Pagination support** for ticket listings
- **Activity logging** for audit trails
- **Notification service** with mock email/SMS functionality
- **Input validation** using express-validator
- **Error handling** with custom error classes
- **Modular MVC architecture**

### Frontend Features

- **React 19** with React Router for navigation
- **Tailwind CSS** for modern, responsive UI
- **Role-based routing** with protected routes
- **Authentication** with JWT token management
- **Real-time search** with debouncing
- **Interactive dashboards** with charts (Recharts)
- **Toast notifications** for user feedback
- **Modal dialogs** for forms and confirmations
- **Loading states** and error boundaries
- **Keyboard shortcuts** (Ctrl+N for new ticket)
- **Responsive design** for all screen sizes

## 📁 Project Structure

```
proxima_crm/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── ticketController.js      # Ticket operations
│   │   └── userController.js        # User management
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── authorize.js             # Role-based access
│   │   ├── activityLogger.js        # Activity logging
│   │   └── validation.js            # Input validation
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Ticket.js                # Ticket schema
│   │   └── ActivityLog.js           # Activity log schema
│   ├── routes/
│   │   ├── auth.js                  # Auth routes
│   │   ├── tickets.js               # Ticket routes
│   │   ├── users.js                 # User routes
│   │   └── activityLogs.js          # Activity log routes
│   ├── services/
│   │   └── notificationService.js   # Email/SMS notifications
│   ├── utils/
│   │   ├── errors.js                # Custom error classes
│   │   └── queryBuilder.js          # MongoDB query builder
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── common/
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── PriorityBadge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   ├── TicketTable.jsx
│   │   │   │   └── ChartsSection.jsx
│   │   │   ├── tickets/
│   │   │   │   ├── TicketForm.jsx
│   │   │   │   ├── TicketFilters.jsx
│   │   │   │   └── TicketDetails.jsx
│   │   │   ├── agents/
│   │   │   │   └── AgentList.jsx
│   │   │   └── activity/
│   │   │       └── ActivityLogViewer.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TicketsPage.jsx
│   │   │   ├── AgentsPage.jsx
│   │   │   └── ActivityLogsPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Frontend environment variables
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start (Recommended)

1. **Clone or download the project:**

```bash
cd /path/to/proxima_crm
```

2. **Start MongoDB:**

```bash
# If using local MongoDB
mongod
```

3. **Setup Backend:**

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/proxima_crm
JWT_SECRET=your-secret-key-here
EOF

# Start backend server
npm start
```

4. **Setup Frontend (in a new terminal):**

```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# Start frontend
npm start
```

5. **Access the application:**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001/api`

### Detailed Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/proxima_crm
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. Start the server:

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The backend will run on `http://localhost:5001`

### Detailed Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

4. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Initial Setup - Creating Admin User

After starting the backend, create an admin user using curl or Postman:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!",
    "role": "admin"
  }'
```

Then login to get your JWT token:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

Save the returned token for subsequent API requests.

## 🔑 API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully"
}
```

**Roles:** `admin`, `agent`, `user`

---

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "role": "user"
}
```

---

### Tickets

#### Get All Tickets

```http
GET /api/tickets?search=bug&status=Open&priority=High&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**

- `search` - Search in title and description
- `status` - Filter by status (Open, In Progress, Resolved)
- `priority` - Filter by priority (Low, Medium, High)
- `assignedAgent` - Filter by assigned agent ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**

```json
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Login Bug",
      "description": "Users cannot login",
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

---

#### Create Ticket

```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cannot access dashboard",
  "description": "Getting 404 error when trying to access the dashboard",
  "priority": "Medium"
}
```

**Response (201):**

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

---

#### Update Ticket

```http
PUT /api/tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress",
  "priority": "High"
}
```

**Response (200):**

```json
{
  "message": "Ticket updated successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "status": "In Progress",
    "priority": "High"
  }
}
```

**Permissions:**

- Users can update their own tickets
- Agents/Admins can update any ticket

---

#### Assign Ticket to Agent

```http
PUT /api/tickets/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "507f1f77bcf86cd799439022"
}
```

**Response (200):**

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

**Permissions:** Admin and Agent only

---

#### Delete Ticket

```http
DELETE /api/tickets/:id
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Ticket deleted successfully"
}
```

**Permissions:**

- Users can delete their own tickets
- Admins can delete any ticket

---

#### Get Ticket Activity Logs

```http
GET /api/tickets/:id/activity
Authorization: Bearer <token>
```

**Response (200):**

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
    }
  ]
}
```

---

### Users

#### Get All Agents

```http
GET /api/users/agents
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "agents": [
    {
      "_id": "507f1f77bcf86cd799439022",
      "username": "agent_smith",
      "role": "agent"
    }
  ]
}
```

**Permissions:** Admin and Agent only

---

#### Get All Users

```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

**Response (200):**

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

**Permissions:** Admin only

---

#### Update User Role

```http
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "agent"
}
```

**Response (200):**

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

**Permissions:** Admin only

---

### Activity Logs

#### Get All Activity Logs

```http
GET /api/activity-logs?page=1&limit=50
Authorization: Bearer <token>
```

**Response (200):**

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

**Permissions:** Admin only

---

## ⚠️ Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**401 Unauthorized:**

```json
{
  "message": "No token provided"
}
```

**403 Forbidden:**

```json
{
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**

```json
{
  "message": "Ticket not found"
}
```

**500 Internal Server Error:**

```json
{
  "message": "Internal server error",
  "error": "Error details..."
}
```

## 👥 User Roles

### Admin

- Full access to all features
- Manage users and agents
- View all tickets
- Access activity logs
- Delete any ticket

### Agent

- View assigned tickets and unassigned tickets
- Update ticket status
- Assign tickets to themselves
- View activity logs

### User

- Create tickets
- View own tickets
- Update own tickets
- Delete own tickets

## 🎨 Key Features Implementation

### Technology Stack

#### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js 5.1** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose 8.20** - Elegant MongoDB object modeling
- **JWT (jsonwebtoken 9.0)** - Secure authentication tokens
- **bcryptjs 3.0** - Password hashing
- **express-validator 7.0** - Request validation middleware
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

#### Frontend

- **React 19.2** - UI library with latest features
- **React Router DOM 7.9** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Recharts 3.4** - Composable charting library
- **Lucide React 0.554** - Beautiful icons
- **react-hot-toast 2.6** - Elegant toast notifications

#### Development Tools

- **nodemon** - Auto-restart server on changes
- **PostCSS & Autoprefixer** - CSS processing
- **React Scripts 5.0** - Build tooling

### Architecture Overview

#### Backend Architecture (MVC Pattern)

```
┌─────────────────────────────────────────────────────┐
│                    Client Request                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Middleware Layer                    │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │   CORS   │→ │    Auth    │→ │   Validation    │ │
│  └──────────┘  └────────────┘  └─────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                    Routes Layer                      │
│     /auth    /tickets    /users    /activity-logs   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                 Controllers Layer                    │
│   AuthController  TicketController  UserController  │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Services Layer                      │
│    NotificationService    QueryBuilder    Errors    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   Models Layer                       │
│         User Model    Ticket Model    Log Model     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                MongoDB Database                      │
└─────────────────────────────────────────────────────┘
```

#### Frontend Architecture (Component-Based)

```
┌─────────────────────────────────────────────────────┐
│                     App.jsx                          │
│              (Main Router & Layout)                  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐  ┌──────────┐  ┌────────────┐
│  AuthContext│  │  Pages   │  │ Components │
│   Provider  │  │          │  │            │
└─────────────┘  └────┬─────┘  └──────┬─────┘
                      │               │
        ┌─────────────┼───────────────┼──────────┐
        │             │               │          │
        ▼             ▼               ▼          ▼
   Dashboard     Tickets         Agents     Activity
      Page         Page           Page        Logs
        │             │               │          │
        └─────────────┴───────────────┴──────────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
        Shared Components   API Service
        (Modal, Badge,       (axios)
         Spinner, etc.)
```

### Search & Filtering

The application supports advanced filtering with the `QueryBuilder` utility:

```javascript
// Frontend: Debounced search with filters
const [filters, setFilters] = useState({
  search: '',
  status: '',
  priority: '',
  page: 1,
  limit: 10
});

// Backend: Dynamic query building
class QueryBuilder {
  constructor(query) {
    this.query = query;
    this.filter = {};
  }

  search(fields, searchTerm) {
    if (searchTerm) {
      this.filter.$or = fields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' }
      }));
    }
    return this;
  }

  filterBy(field, value) {
    if (value) this.filter[field] = value;
    return this;
  }

  paginate(page, limit) {
    const skip = (page - 1) * limit;
    return this.query.skip(skip).limit(limit);
  }

  execute() {
    return this.query.find(this.filter);
  }
}

// Example: Search tickets with status and priority filters
GET /api/tickets?search=laptop&status=Open&priority=High&page=1&limit=10
```

### Notifications

Automatic notifications are triggered on:

- **Ticket Creation**: Notifies admins and available agents
- **Status Changes**:
  - Open → In Progress: Notifies ticket creator
  - In Progress → Resolved: Notifies ticket creator and admin
- **Ticket Assignment**: Notifies assigned agent
- **Ticket Deletion**: Logs action for audit trail

Notification Service (Mock Implementation):

```javascript
class NotificationService {
  async sendNotification(type, recipient, message) {
    console.log(`[${type}] To: ${recipient} - ${message}`);
    // TODO: Integrate with email service (SendGrid, AWS SES)
    // TODO: Integrate with SMS service (Twilio)
  }
}
```

### Activity Logging

All CRUD operations are automatically logged with:

- **User**: Who performed the action
- **Action Type**: CREATE, UPDATE, DELETE, ASSIGN
- **Entity**: Type and ID of the affected resource
- **Timestamp**: When the action occurred
- **Changes**: Object diff of what changed

Activity Logger Middleware:

```javascript
const activityLogger = (action, entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      // Log after successful operation
      if (res.statusCode >= 200 && res.statusCode < 300) {
        ActivityLog.create({
          user: req.user.id,
          action,
          entityType,
          entityId: req.params.id || extractId(data),
          changes: extractChanges(req.body),
          timestamp: new Date(),
        });
      }
      originalSend.call(this, data);
    };
    next();
  };
};
```

### Real-time Search

Frontend implements debounced search with 500ms delay to optimize API calls while providing responsive user experience:

```javascript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchTerm, 500);
useEffect(() => {
  fetchTickets({ search: debouncedSearch });
}, [debouncedSearch]);
```

### Authentication Flow

1. **User Registration**:

   - Client sends username, password, role
   - Server validates input
   - Password hashed with bcrypt (10 rounds)
   - User saved to database

2. **User Login**:

   - Client sends username, password
   - Server verifies credentials
   - JWT generated with user payload
   - Token sent to client

3. **Protected Routes**:

   - Client sends token in Authorization header
   - Server verifies token signature
   - User data extracted from token
   - Request proceeds if valid

4. **Role-Based Access**:
   - Middleware checks user role
   - Compares against required roles
   - Grants or denies access

### Error Handling

Custom error classes for consistent error responses:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}
```

## 🧪 Testing

### API Testing with curl

#### 1. Register and Login

```bash
# Register a user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Test123!", "role": "user"}'

# Login
TOKEN=$(curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "Test123!"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

#### 2. Create a Ticket

```bash
curl -X POST http://localhost:5001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "App crashes on startup",
    "description": "The application crashes immediately after launching",
    "priority": "High"
  }'
```

#### 3. Get All Tickets

```bash
# Get all tickets
curl -X GET "http://localhost:5001/api/tickets" \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl -X GET "http://localhost:5001/api/tickets?status=Open&priority=High&search=crash" \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Update Ticket

```bash
curl -X PUT http://localhost:5001/api/tickets/TICKET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "In Progress",
    "priority": "Medium"
  }'
```

#### 5. Assign Ticket (Admin/Agent only)

```bash
curl -X PUT http://localhost:5001/api/tickets/TICKET_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"agentId": "AGENT_USER_ID"}'
```

### API Testing with Postman

**Import the collection:**

1. Create a new collection in Postman named "Service Helpdesk CRM"
2. Add environment variables:
   - `base_url`: `http://localhost:5001/api`
   - `token`: (will be set after login)

**Example requests:**

1. **Register User**

   - Method: POST
   - URL: `{{base_url}}/auth/register`
   - Body (JSON):

   ```json
   {
     "username": "admin",
     "password": "Admin123!",
     "role": "admin"
   }
   ```

2. **Login**

   - Method: POST
   - URL: `{{base_url}}/auth/login`
   - Body (JSON):

   ```json
   {
     "username": "admin",
     "password": "Admin123!"
   }
   ```

   - Tests tab (to save token):

   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

3. **Create Ticket**
   - Method: POST
   - URL: `{{base_url}}/tickets`
   - Headers: `Authorization: Bearer {{token}}`
   - Body (JSON):
   ```json
   {
     "title": "Bug Report",
     "description": "Detailed description",
     "priority": "High"
   }
   ```

### Manual UI Testing Workflow

1. **User Registration & Login:**

   - Open `http://localhost:3000`
   - Login with credentials (or register new user via API)
   - Default credentials: admin/Admin123!

2. **Create Tickets:**

   - Navigate to Tickets page
   - Click "New Ticket" or press `Ctrl+N`
   - Fill in title, description, priority
   - Submit and verify ticket appears in list

3. **Filter & Search:**

   - Use search bar to find tickets by title/description
   - Apply status filters (Open, In Progress, Resolved)
   - Apply priority filters (Low, Medium, High)
   - Test pagination controls

4. **Assign Tickets (Agent/Admin):**

   - Click on a ticket
   - Select "Assign to Agent"
   - Choose agent from dropdown
   - Verify notification appears

5. **Activity Logs (Admin):**

   - Navigate to Activity Logs page
   - Verify all CRUD operations are logged
   - Check pagination

6. **User Management (Admin):**
   - Navigate to Agents page
   - View all agents
   - Test role updates via API

### Build for Production

```bash
cd frontend
npm run build
```

The optimized production build will be in the `build` folder.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization middleware
- Input validation and sanitization
- Protected API routes
- CORS configuration
- Environment variable management

## 📊 Database Schema

### User Schema

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: admin, agent, user),
  createdAt: Date
}
```

### Ticket Schema

```javascript
{
  title: String (required),
  description: String (required),
  status: String (enum: Open, In Progress, Resolved),
  priority: String (enum: Low, Medium, High),
  createdBy: String (required),
  assignedAgent: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Log Schema

```javascript
{
  user: ObjectId (ref: User),
  action: String (enum: CREATE, UPDATE, DELETE, ASSIGN),
  entityType: String (required),
  entityId: String (required),
  changes: Object,
  timestamp: Date
}
```

## 🚀 Deployment

### Environment Variables Reference

#### Backend (.env)

```env
# Server Configuration
PORT=5001                                    # Server port
NODE_ENV=production                          # Environment (development/production)

# Database
MONGODB_URI=mongodb://localhost:27017/proxima_crm    # MongoDB connection string

# JWT Authentication
JWT_SECRET=your-very-secure-secret-key-here  # Secret key for JWT (change this!)
JWT_EXPIRES_IN=7d                            # Token expiration (7d, 24h, etc.)
```

#### Frontend (.env)

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api  # Backend API URL
# For production: https://your-backend-domain.com/api
```

### Deployment Options

#### Option 1: Deploy Backend to Render

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service:**
   - Connect your GitHub repository
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
3. **Set Environment Variables:**

   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proxima_crm
   JWT_SECRET=your-secure-secret-key
   NODE_ENV=production
   ```

4. **Deploy** and note the URL (e.g., `https://proxima-crm.onrender.com`)

#### Option 2: Deploy Backend to Railway

1. **Create account** at [railway.app](https://railway.app)

2. **New Project** → **Deploy from GitHub repo**

3. **Configure:**

   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add MongoDB:**

   - Add Plugin → MongoDB
   - Railway provides `MONGODB_URI` automatically

5. **Set remaining environment variables**

#### Option 3: Deploy Backend to Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from heroku.com

# Login
heroku login

# Create app
cd backend
heroku create proxima-crm-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Deploy Frontend to Vercel

1. **Create account** at [vercel.com](https://vercel.com)

2. **Import Project:**

   - Connect GitHub repository
   - Root Directory: `frontend`
   - Framework Preset: Create React App

3. **Environment Variables:**

   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy** - Vercel will provide a URL (e.g., `https://proxima-crm.vercel.app`)

#### Deploy Frontend to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build production version
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build

# Set environment variable in Netlify dashboard:
# REACT_APP_API_URL=https://your-backend-url.com/api
```

#### Docker Deployment

Create `docker-compose.yml` in project root:

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - PORT=5001
      - MONGODB_URI=mongodb://mongodb:27017/proxima_crm
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5001/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy with:

```bash
docker-compose up -d
```

### Production Checklist

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Update MongoDB URI to production database
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domains
- [ ] Set up database backups
- [ ] Configure monitoring (e.g., PM2, New Relic)
- [ ] Set up error logging (e.g., Sentry)
- [ ] Test all API endpoints in production
- [ ] Verify frontend connects to production API
- [ ] Set appropriate JWT expiration time
- [ ] Review and update security headers
- [ ] Set up CI/CD pipeline (GitHub Actions, etc.)

## 📝 Development Workflow

1. **Backend Development**: Start with `npm run dev` (with nodemon)
2. **Frontend Development**: Start with `npm start`
3. **Testing**: Run tests before committing
4. **Building**: Build frontend before deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for Proxima

## 🐛 Known Issues & Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"

**Solution:**

```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
mongod  # Manual start
```

#### 2. "Port 5001 already in use"

**Solution:**

```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9

# Or change the port in backend/.env
PORT=5002
```

#### 3. "CORS Error" when calling API from frontend

**Solution:**

- Ensure backend is running on port 5001
- Check `REACT_APP_API_URL` in frontend/.env
- Verify CORS is enabled in backend/server.js

#### 4. "Token expired" error

**Solution:**

- Login again to get a new token
- Token expires after 1 hour by default
- Increase `JWT_EXPIRES_IN` in backend/.env if needed

#### 5. Frontend shows blank page

**Solution:**

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 6. "403 Forbidden" when creating user

**Solution:**

- Ensure you're sending the request to `/api/auth/register` (not `/api/users`)
- Check that request body includes `username`, `password`, and `role`
- Verify Content-Type header is `application/json`

### Development Issues

- **Frontend warnings about React Hook dependencies:** Intentionally suppressed with eslint comments for optimal performance
- **npm audit vulnerabilities from react-scripts:** Not security-critical; part of development dependencies
- **MongoDB deprecation warnings:** Can be ignored; using latest Mongoose version

### Performance Optimization

1. **Slow ticket loading:**

   - Reduce `limit` parameter in API calls
   - Add database indexes: `db.tickets.createIndex({ createdBy: 1, status: 1 })`

2. **Search performance:**
   - Frontend implements 500ms debounce
   - Backend uses efficient MongoDB queries with QueryBuilder

## 📚 Usage Examples

### Complete Workflow Example

#### 1. Setup and Create Admin

```bash
# Start backend
cd backend && npm start

# In another terminal, create admin user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!", "role": "admin"}'

# Login and save token
export TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}' \
  | jq -r '.token')
```

#### 2. Create Agent and User Accounts

```bash
# Create agent
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "agent1", "password": "Agent123!", "role": "agent"}'

# Create regular user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "User123!", "role": "user"}'
```

#### 3. User Creates Ticket

```bash
# Login as user
export USER_TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "User123!"}' \
  | jq -r '.token')

# Create ticket
TICKET_ID=$(curl -s -X POST http://localhost:5001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "title": "Cannot reset password",
    "description": "The password reset link is not working",
    "priority": "High"
  }' | jq -r '._id')

echo "Created ticket: $TICKET_ID"
```

#### 4. Admin Assigns Ticket to Agent

```bash
# Get agent ID
AGENT_ID=$(curl -s -X GET http://localhost:5001/api/users/agents \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.agents[0]._id')

# Assign ticket
curl -X PUT http://localhost:5001/api/tickets/$TICKET_ID/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"agentId\": \"$AGENT_ID\"}"
```

#### 5. Agent Updates Ticket Status

```bash
# Login as agent
export AGENT_TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "agent1", "password": "Agent123!"}' \
  | jq -r '.token')

# Update ticket status
curl -X PUT http://localhost:5001/api/tickets/$TICKET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -d '{"status": "In Progress"}'

# Later, resolve the ticket
curl -X PUT http://localhost:5001/api/tickets/$TICKET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_TOKEN" \
  -d '{"status": "Resolved"}'
```

#### 6. View Activity Logs

```bash
# Admin views all activity logs
curl -X GET "http://localhost:5001/api/activity-logs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.logs[] | {user: .user.username, action, entityType, timestamp}'
```

### Frontend Usage

#### Keyboard Shortcuts

- `Ctrl+N` or `Cmd+N` - Create new ticket (on Tickets page)
- `Esc` - Close modal dialogs

#### User Roles & Permissions

**Admin:**

- Access all pages (Dashboard, Tickets, Agents, Activity Logs)
- View and manage all tickets
- Assign tickets to agents
- View all users and activity logs
- Change user roles

**Agent:**

- Access Dashboard, Tickets, and Agents pages
- View all tickets
- Update ticket status
- Assign tickets to self or other agents
- Cannot delete tickets or manage users

**User:**

- Access Dashboard and Tickets pages
- Create new tickets
- View own tickets only
- Update own tickets
- Delete own tickets
- Cannot assign tickets or view activity logs

## 🔮 Future Enhancements

- Real email/SMS integration (currently mock)
- File attachments for tickets
- Real-time updates using WebSockets
- Advanced analytics dashboard
- Ticket templates
- SLA management
- Multi-language support
- Dark mode

## 📞 Support

For issues and questions, please create an issue in the repository.
