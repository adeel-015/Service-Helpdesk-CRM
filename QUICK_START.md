# Service Helpdesk CRM - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas account
- Terminal/Command Prompt

### Step 1: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or run manually
mongod
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/proxima_crm
JWT_SECRET=my-super-secret-key-change-this-in-production
EOF

# Start server
npm start
```

✅ Backend running at `http://localhost:5001`

### Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# Start app
npm start
```

✅ Frontend running at `http://localhost:3000`

### Step 4: Create Admin User

```bash
# In a new terminal
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!", "role": "admin"}'
```

### Step 5: Login

1. Open `http://localhost:3000` in your browser
2. Login with:
   - Username: `admin`
   - Password: `Admin123!`

## 🎯 Quick API Test

### Get a Token

```bash
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Your token: $TOKEN"
```

### Create a Ticket

```bash
curl -X POST http://localhost:5001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Ticket",
    "description": "This is a test ticket",
    "priority": "High"
  }'
```

### Get All Tickets

```bash
curl -X GET http://localhost:5001/api/tickets \
  -H "Authorization: Bearer $TOKEN"
```

## 📚 Common Commands

### Backend

```bash
cd backend
npm start          # Start server
npm run dev        # Start with auto-reload (nodemon)
```

### Frontend

```bash
cd frontend
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

## 🔑 Default Users

After creating the admin user, you can create test accounts:

```bash
# Create Agent
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "agent1", "password": "Agent123!", "role": "agent"}'

# Create Regular User
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "User123!", "role": "user"}'
```

## 🎨 UI Features

- **Dashboard**: View statistics and charts
- **Tickets Page**: Manage all tickets with filters
- **Agents Page**: View and manage agents (Admin only)
- **Activity Logs**: View all system activities (Admin only)

### Keyboard Shortcuts

- `Ctrl+N` / `Cmd+N` - Create new ticket
- `Esc` - Close modal

## 📖 API Endpoints Quick Reference

| Method | Endpoint                  | Description       | Auth        |
| ------ | ------------------------- | ----------------- | ----------- |
| POST   | `/api/auth/register`      | Register user     | None        |
| POST   | `/api/auth/login`         | Login user        | None        |
| GET    | `/api/tickets`            | Get all tickets   | Required    |
| POST   | `/api/tickets`            | Create ticket     | Required    |
| PUT    | `/api/tickets/:id`        | Update ticket     | Required    |
| DELETE | `/api/tickets/:id`        | Delete ticket     | Required    |
| PUT    | `/api/tickets/:id/assign` | Assign ticket     | Admin/Agent |
| GET    | `/api/users/agents`       | Get all agents    | Admin/Agent |
| GET    | `/api/activity-logs`      | Get activity logs | Admin       |

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

```bash
# Check if MongoDB is running
ps aux | grep mongo

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### "Port 5001 already in use"

```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### "CORS Error"

- Ensure backend is running on port 5001
- Check `REACT_APP_API_URL` in `frontend/.env`

### Frontend shows blank page

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🔗 Useful Links

- Full Documentation: [README.md](./README.md)
- Backend URL: `http://localhost:5001`
- Frontend URL: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/proxima_crm`

## 📞 Need Help?

Check the main [README.md](./README.md) for:

- Detailed API documentation
- Deployment guides
- Architecture overview
- Advanced features
- Complete usage examples
