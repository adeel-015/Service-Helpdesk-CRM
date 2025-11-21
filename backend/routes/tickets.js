const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticketController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const activityLogger = require("../middleware/activityLogger");
const {
  ticketValidation,
  ticketUpdateValidation,
  assignAgentValidation,
  validate,
  ticketQueryValidation,
} = require("../middleware/validation");

router.use(authenticate);

router.get(
  "/",
  ticketQueryValidation,
  validate,
  TicketController.getAllTickets
);
router.post(
  "/",
  ticketValidation,
  validate,
  activityLogger("CREATE", "Ticket"),
  TicketController.createTicket
);
router.put(
  "/:id",
  ticketUpdateValidation,
  validate,
  activityLogger("UPDATE", "Ticket"),
  TicketController.updateTicket
);

router.put(
  "/:id/assign",
  authorize("admin", "agent"),
  assignAgentValidation,
  validate,
  activityLogger("ASSIGN", "Ticket"),
  TicketController.assignTicketToAgent
);

router.delete(
  "/:id",
  activityLogger("DELETE", "Ticket"),
  TicketController.deleteTicket
);

router.get("/:id/activity", TicketController.getTicketActivityLogs);

module.exports = router;
