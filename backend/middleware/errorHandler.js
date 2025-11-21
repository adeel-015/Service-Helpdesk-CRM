const { AppError, ValidationError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  // Mongoose validation errors
  if (err.name === "ValidationError" && !(err instanceof AppError)) {
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.errors });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Fallback for unhandled errors
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
