const { ForbiddenError } = require("../utils/errors");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return next(
        new ForbiddenError("Access denied. Insufficient permissions.")
      );
    }
    next();
  };
};

module.exports = authorize;
