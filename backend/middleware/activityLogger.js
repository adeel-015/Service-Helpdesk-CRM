const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");

/**
 * activityLogger factory
 * @param {string} action - CREATE|UPDATE|DELETE|ASSIGN
 * @param {string} entityType - Ticket|User
 *
 * Contract: Controllers that use this middleware MUST set `res.locals.result`
 * (or `res.locals.entityId`) to an object containing a valid `_id`, or set
 * `res.locals.entityId` to the target id before sending the response. The
 * logger will prefer `req.params.id`, then `res.locals.entityId`, then
 * `res.locals.result._id` to determine the entityId. If no entityId can be
 * derived, the logger will skip creating an ActivityLog and emit a warning so
 * misconfigurations are easier to detect.
 */
const activityLogger = (action, entityType) => {
  return async (req, res, next) => {
    try {
      // capture before state for UPDATE
      if (action === "UPDATE") {
        const id = req.params.id || req.body.id;
        if (id && mongoose.isValidObjectId(id)) {
          const Model = require(`../models/${entityType}`);
          try {
            const before = await Model.findById(id).lean();
            res.locals._before = before;
          } catch (e) {
            // ignore
          }
        }
      }

      // after response finished, create log if successful
      res.on("finish", async () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            const userId = req.user?.id || req.user?._id || null;
            let entityId =
              req.params.id || (res.locals && res.locals.entityId) || null;
            if (
              !entityId &&
              res.locals &&
              res.locals.result &&
              res.locals.result._id
            ) {
              entityId = res.locals.result._id;
            }

            const changes = {};
            if (action === "CREATE")
              changes.after = res.locals.result || req.body;
            if (action === "UPDATE") {
              changes.before = res.locals._before || null;
              changes.after = res.locals.result || req.body;
            }
            if (action === "ASSIGN")
              changes.after = res.locals.result || req.body;

            if (entityId && mongoose.isValidObjectId(entityId)) {
              await ActivityLog.create({
                user: userId,
                action,
                entityType,
                entityId: new mongoose.Types.ObjectId(entityId),
                changes,
                metadata: { ip: req.ip, ua: req.get("User-Agent") },
              });
            } else {
              console.warn(
                `activityLogger: could not determine entityId for ${action} ${entityType} - skipping log`
              );
            }
          }
        } catch (e) {
          console.error("ActivityLogger error:", e);
        }
      });

      next();
    } catch (err) {
      // don't block main flow
      console.error("activityLogger factory error", err);
      next();
    }
  };
};

module.exports = activityLogger;
