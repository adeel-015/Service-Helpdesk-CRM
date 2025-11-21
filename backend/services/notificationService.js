/**
 * NotificationService
 *
 * A small mock notification service used for development/testing. It logs
 * notification activities to the console and stores a simple in-memory log
 * of notifications for verification.
 *
 * NOTE: These implementations are mocks. Replace with real email/SMS
 * adapters in production.
 */
class NotificationService {
  /**
   * Internal notification log for testing purposes.
   * @type {Array<Object>}
   */
  static _notificationLog = [];

  /**
   * Send email notification (mock implementation)
   * @param {string} to
   * @param {string} subject
   * @param {string} body
   */
  static sendEmail(to, subject, body) {
    const record = { type: "email", to, subject, body, timestamp: new Date() };
    this._notificationLog.push(record);
    console.log("\n========== EMAIL NOTIFICATION ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("========================================\n");
    return record;
  }

  /**
   * Send SMS notification (mock implementation)
   * @param {string} phoneNumber
   * @param {string} message
   */
  static sendSMS(phoneNumber, message) {
    const record = {
      type: "sms",
      to: phoneNumber,
      message,
      timestamp: new Date(),
    };
    this._notificationLog.push(record);
    console.log("\n========== SMS NOTIFICATION ==========");
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    console.log("======================================\n");
    return record;
  }

  /**
   * Batch send notifications. Each item: { type: 'email'|'sms', ...params }
   * Returns a summary: { emails: n, sms: m }
   * @param {Array<Object>} notifications
   */
  static sendBatchNotifications(notifications = []) {
    const summary = { emails: 0, sms: 0 };
    notifications.forEach((n) => {
      if (!n || !n.type) return;
      if (n.type === "email") {
        this.sendEmail(n.to, n.subject, n.body);
        summary.emails += 1;
      } else if (n.type === "sms") {
        this.sendSMS(n.to, n.message);
        summary.sms += 1;
      }
    });
    return summary;
  }

  /**
   * Get the in-memory notification log (for tests / verification)
   * @returns {Array<Object>}
   */
  static getNotificationLog() {
    return Array.from(this._notificationLog);
  }

  /**
   * Notify on ticket status change
   */
  static notifyTicketStatusChange(ticket, oldStatus, newStatus, user) {
    const statusChangeMessage = `Ticket #${ticket._id} status changed from "${oldStatus}" to "${newStatus}" by ${user.username}`;

    // Send email notification
    this.sendEmail(
      (ticket.createdBy || "unknown") + "@example.com",
      `Ticket Status Updated: ${ticket.title}`,
      statusChangeMessage
    );

    // Send SMS notification
    this.sendSMS("+1234567890", statusChangeMessage);

    console.log(
      `✓ Notifications sent for ticket status change: ${oldStatus} → ${newStatus}`
    );
  }

  /**
   * Notify on ticket assignment
   */
  static notifyTicketAssignment(ticket, agent, assignedBy) {
    const assignmentMessage = `Ticket #${ticket._id} "${ticket.title}" has been assigned to you by ${assignedBy.username}`;

    // Send email to agent
    this.sendEmail(
      (agent.username || "agent") + "@example.com",
      `New Ticket Assigned: ${ticket.title}`,
      assignmentMessage
    );

    // Send SMS to agent
    this.sendSMS(agent.phone || "+1234567890", assignmentMessage);

    console.log(`✓ Assignment notifications sent to agent: ${agent.username}`);
  }

  /**
   * Notify on ticket creation
   */
  static notifyTicketCreation(ticket, creator) {
    const creationMessage = `Your ticket "${ticket.title}" has been created successfully. Priority: ${ticket.priority}, Status: ${ticket.status}`;

    // Send confirmation email
    this.sendEmail(
      (creator.username || "user") + "@example.com",
      `Ticket Created: ${ticket.title}`,
      creationMessage
    );

    console.log(`✓ Creation notification sent to: ${creator.username}`);
  }

  /**
   * Notify on ticket deletion
   */
  static notifyTicketDeletion(ticket, deletedBy) {
    const deletionMessage = `Ticket #${ticket._id} "${ticket.title}" has been deleted by ${deletedBy.username}`;

    // Notify ticket creator
    this.sendEmail(
      (ticket.createdBy || "user") + "@example.com",
      `Ticket Deleted: ${ticket.title}`,
      deletionMessage
    );

    console.log(`✓ Deletion notification sent for ticket: ${ticket.title}`);
  }

  /**
   * Record notification activity into ActivityLog (non-fatal)
   * @param {Object} ticket
   * @param {Object} user
   * @param {Object} details
   */
  static async _recordNotificationActivity(ticket, user, details = {}) {
    try {
      const ActivityLog = require("../models/ActivityLog");
      await ActivityLog.create({
        user: user?.id || user?._id || null,
        action: "NOTIFY",
        entityType: "Ticket",
        entityId: ticket?._id || null,
        changes: details,
        metadata: { recordedBy: user?.username || null, timestamp: new Date() },
      });
    } catch (e) {
      // don't throw; logging only
      console.error(
        "NotificationService._recordNotificationActivity failed:",
        e
      );
    }
  }
}

module.exports = NotificationService;
