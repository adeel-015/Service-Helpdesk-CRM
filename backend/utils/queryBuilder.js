const mongoose = require("mongoose");

/**
 * QueryBuilder
 *
 * Utility class to build MongoDB query objects for ticket searches and filters.
 * It supports chaining and defensive checks to avoid malformed queries (e.g.
 * invalid ObjectId values).
 *
 * Example:
 * const qb = new QueryBuilder();
 * qb.addSearch('login').addStatusFilter('Open').addAssignedAgentFilter(agentId);
 * const filter = qb.build();
 *
 */
class QueryBuilder {
  constructor() {
    /**
     * Internal MongoDB query object being built.
     * @type {Object}
     */
    this.query = {};
  }

  /**
   * Clears the internal query so the instance can be reused.
   * @returns {QueryBuilder}
   */
  reset() {
    this.query = {};
    return this;
  }

  /**
   * Add search condition for title and description (case-insensitive substring).
   * @param {string} searchTerm
   * @returns {QueryBuilder}
   */
  addSearch(searchTerm) {
    if (searchTerm && String(searchTerm).trim()) {
      const term = String(searchTerm).trim();
      this.query.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }
    return this;
  }

  /**
   * Add status filter
   * @param {string} status
   * @returns {QueryBuilder}
   */
  addStatusFilter(status) {
    if (status) {
      this.query.status = status;
    }
    return this;
  }

  /**
   * Add priority filter
   * @param {string} priority
   * @returns {QueryBuilder}
   */
  addPriorityFilter(priority) {
    if (priority) {
      this.query.priority = priority;
    }
    return this;
  }

  /**
   * Add assigned agent filter. Validates ObjectId before adding to query.
   * @param {string} agentId
   * @returns {QueryBuilder}
   */
  addAssignedAgentFilter(agentId) {
    if (agentId && mongoose.isValidObjectId(agentId)) {
      this.query.assignedAgent = agentId;
    }
    return this;
  }

  /**
   * Add role-based visibility filter.
   * Admin: sees all tickets.
   * Agent: sees assigned to them or unassigned.
   * User: sees only their created tickets.
   *
   * @param {string} userRole
   * @param {string} userId
   * @param {string} username
   * @returns {QueryBuilder}
   */
  addRoleBasedFilter(userRole, userId, username) {
    if (userRole === "admin") {
      // Admin sees all tickets - no additional filter needed
      return this;
    } else if (userRole === "agent") {
      // Agent sees tickets assigned to them or unassigned
      const agentFilter = {
        $or: [{ assignedAgent: userId }, { assignedAgent: null }],
      };

      // If there's already an $or condition (from search), we need to combine them
      if (this.query.$or) {
        this.query.$and = [{ $or: this.query.$or }, { $or: agentFilter.$or }];
        delete this.query.$or;
      } else {
        this.query.$or = agentFilter.$or;
      }
    } else {
      // User sees only their own tickets
      this.query.createdBy = username;
    }
    return this;
  }

  /**
   * Get the final query object
   * @returns {Object}
   */
  build() {
    return this.query;
  }
}

module.exports = QueryBuilder;
