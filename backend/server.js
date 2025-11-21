/**
 * Service Helpdesk CRM ASSIGNMENT - BACKEND
 * Option: Helpdesk CRM
 * Author: Adeel Javed
 * * Features:
 * 1. MongoDB Connection
 * 2. JWT Authentication (Login/Register)
 * 3. Ticket CRUD Operations
 * 4. Admin Role Check
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const userRoutes = require("./routes/users");
const activityLogRoutes = require("./routes/activityLogs");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity-logs", activityLogRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler (last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
