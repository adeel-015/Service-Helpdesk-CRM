const Ticket = require("../models/Ticket");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { NotFoundError, ForbiddenError } = require("../utils/errors");
const QueryBuilder = require("../utils/queryBuilder");
const NotificationService = require("../services/notificationService");

/**
 * TicketController
 *
 * Controller responsible for ticket CRUD, assignment, and activity retrieval.
 * Integrates with QueryBuilder, NotificationService and ActivityLog middleware.
 */
class TicketController {
  /**
   * Get tickets based on role with search/filter/pagination
   *
   * Query params:
   * - search: string (optional)
   * - status: enum (Open, In Progress, Resolved)
   * - priority: enum (Low, Medium, High)
   * - assignedAgent: ObjectId (optional)
   * - page: integer (default 1)
   * - limit: integer (default 10, max 100)
   *
   * Response: { tickets: [], pagination: { page, limit, total, pages } }
   */
  static async getAllTickets(req, res, next) {
    try {
      const {
        search,
        status,
        priority,
        assignedAgent,
        page = 1,
        limit = 10,
      } = req.query;
      // Defensive pagination handling
      let pageNum = parseInt(page, 10) || 1;
      let limitNum = parseInt(limit, 10) || 10;
      if (pageNum < 1) pageNum = 1;
      if (limitNum < 1) limitNum = 10;
      if (limitNum > 100) limitNum = 100;

      // Build query using QueryBuilder
      const queryBuilder = new QueryBuilder();
      queryBuilder
        .addSearch(search)
        .addStatusFilter(status)
        .addPriorityFilter(priority)
        .addAssignedAgentFilter(assignedAgent)
        .addRoleBasedFilter(req.user.role, req.user.id, req.user.username);

      const filter = queryBuilder.build();

      // Calculate pagination
      const skip = (pageNum - 1) * limitNum;

      // Execute query with pagination
      const tickets = await Ticket.find(filter)
        .populate("assignedAgent", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Ticket.countDocuments(filter);

      // Normalize pages to be at least 1 so clients have a consistent view
      const pages = Math.max(1, Math.ceil(total / limitNum));

      res.json({
        tickets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new ticket
   */
  static async createTicket(req, res, next) {
    try {
      // Only allow explicit fields on creation. assignedAgent must be set via assign endpoint.
      const { title, description, priority, status } = req.body;
      const payload = {
        title,
        description,
        priority,
        status,
        createdBy: req.user.username,
      };
      const newTicket = new Ticket(payload);
      await newTicket.save();
      // Notify on creation (mock notification service)
      try {
        NotificationService.notifyTicketCreation(newTicket, req.user);
      } catch (e) {
        // Log but don't fail the request if notifications fail
        console.error("Failed to send creation notification", e);
      }
      res.locals.result = newTicket;
      res.json(newTicket);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update existing ticket
   */
  static async updateTicket(req, res, next) {
    try {
      const existing = await Ticket.findById(req.params.id);
      if (!existing) return next(new NotFoundError("Ticket"));

      // Authorization: admin OR agent assigned OR ticket creator
      const userId = req.user.id || req.user._id;
      const isAdmin = req.user.role === "admin";
      const isAgentAssigned =
        req.user.role === "agent" &&
        existing.assignedAgent &&
        existing.assignedAgent.toString() === userId.toString();
      const isCreator = existing.createdBy === req.user.username;
      if (!isAdmin && !isAgentAssigned && !isCreator)
        return next(new ForbiddenError("Access denied"));

      // Store old status for notification
      const oldStatus = existing.status;

      // Whitelist updatable fields to prevent changing assignedAgent or other protected fields
      const { title, description, status, priority } = req.body;
      const updatePayload = {};
      if (typeof title !== "undefined") updatePayload.title = title;
      if (typeof description !== "undefined")
        updatePayload.description = description;
      if (typeof status !== "undefined") updatePayload.status = status;
      if (typeof priority !== "undefined") updatePayload.priority = priority;

      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        {
          new: true,
        }
      );
      // Handle edge case: ticket might have been deleted concurrently
      if (!ticket) return next(new NotFoundError("Ticket"));

      // Trigger notification if status changed
      if (status && oldStatus !== status) {
        NotificationService.notifyTicketStatusChange(
          ticket,
          oldStatus,
          status,
          req.user
        );
      }

      res.locals.result = ticket;
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Assign a ticket to an agent
   */
  static async assignTicketToAgent(req, res, next) {
    try {
      const { agentId } = req.body;
      const ticketId = req.params.id;

      const agent = await User.findById(agentId);
      if (!agent || agent.role !== "agent")
        return next(new NotFoundError("Agent"));

      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        { assignedAgent: agent._id },
        { new: true }
      ).populate("assignedAgent", "_id username role");

      if (!ticket) return next(new NotFoundError("Ticket"));

      // Trigger assignment notification
      NotificationService.notifyTicketAssignment(ticket, agent, req.user);

      res.locals.result = ticket;
      res.json(ticket);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a ticket
   */
  static async deleteTicket(req, res, next) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return next(new NotFoundError("Ticket"));

      // Authorization: Only admin or ticket creator can delete
      const isAdmin = req.user.role === "admin";
      const isCreator = ticket.createdBy === req.user.username;
      if (!isAdmin && !isCreator)
        return next(new ForbiddenError("Access denied"));

      await Ticket.findByIdAndDelete(req.params.id);

      // Trigger deletion notification
      NotificationService.notifyTicketDeletion(ticket, req.user);

      res.locals.result = ticket;
      res.json({ message: "Ticket deleted successfully", ticket });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get activity logs for a ticket
   */
  static async getTicketActivityLogs(req, res, next) {
    try {
      const ticketId = req.params.id;
      const logs = await ActivityLog.find({
        entityType: "Ticket",
        entityId: ticketId,
      })
        .populate("user", "username")
        .sort({ timestamp: -1 });
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TicketController;
