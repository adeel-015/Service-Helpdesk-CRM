const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.use(authenticate);

router.get("/", authorize("admin", "agent"), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, user: userFilter } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build filter based on role and query params
    let filter = {};
    
    if (userFilter) {
      // Explicit user filter provided (typically by admins)
      filter.user = userFilter;
    } else if (req.user && req.user.role === "agent") {
      // Agents see activity logs for tickets assigned to them
      const Ticket = require("../models/Ticket");
      const assignedTickets = await Ticket.find({ assignedAgent: req.user.id || req.user._id }).select("_id");
      const ticketIds = assignedTickets.map(t => t._id);
      
      filter = {
        $or: [
          { user: req.user.id || req.user._id }, // Their own actions
          { entityType: "Ticket", entityId: { $in: ticketIds } } // Actions on their assigned tickets
        ]
      };
    }

    const logs = await ActivityLog.find(filter)
      .populate("user", "username")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await ActivityLog.countDocuments(filter);
    res.json({ logs, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
