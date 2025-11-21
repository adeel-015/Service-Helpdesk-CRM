const { body, validationResult, param, query } = require("express-validator");
const { ValidationError } = require("../utils/errors");

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("username")
    .isString()
    .isLength({ min: 3, max: 30 })
    .trim()
    .isAlphanumeric(),
  body("password").isString().isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "agent", "user"]),
];

const loginValidation = [
  body("username").isString(),
  body("password").isString(),
];

const ticketValidation = [
  body("title").isString().isLength({ min: 5, max: 200 }),
  body("description").isString().isLength({ min: 10, max: 2000 }),
  body("priority").optional().isIn(["Low", "Medium", "High"]),
  body("status").optional().isIn(["Open", "In Progress", "Resolved"]),
];

const ticketUpdateValidation = [
  body("title").optional().isString().isLength({ min: 5, max: 200 }),
  body("description").optional().isString().isLength({ min: 10, max: 2000 }),
  body("priority").optional().isIn(["Low", "Medium", "High"]),
  body("status").optional().isIn(["Open", "In Progress", "Resolved"]),
];

const ticketQueryValidation = [
  query("search").optional().isString().isLength({ max: 200 }).trim(),
  query("status").optional().isIn(["Open", "In Progress", "Resolved"]),
  query("priority").optional().isIn(["Low", "Medium", "High"]),
  query("assignedAgent").optional().isMongoId(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

const assignAgentValidation = [
  param("id").isMongoId(),
  body("agentId").isMongoId(),
];

const updateUserRoleValidation = [
  param("id").isMongoId(),
  body("role").isIn(["admin", "agent", "user"]),
];

const profileUpdateValidation = [
  body("username")
    .optional()
    .isString()
    .isLength({ min: 3, max: 30 })
    .trim()
    .isAlphanumeric(),
  body("email").optional().isEmail().normalizeEmail(),
];

const changePasswordValidation = [
  body("oldPassword").isString().isLength({ min: 6 }),
  body("newPassword").isString().isLength({ min: 6 }),
];

const getAllUsersValidation = [
  query("role").optional().isIn(["admin", "agent", "user"]),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errs = errors.array().map((e) => ({ param: e.param, msg: e.msg }));
    return next(new ValidationError("Validation failed", errs));
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  ticketValidation,
  ticketUpdateValidation,
  assignAgentValidation,
  updateUserRoleValidation,
  getAllUsersValidation,
  profileUpdateValidation,
  changePasswordValidation,
  validate,
};

module.exports.ticketQueryValidation = ticketQueryValidation;
