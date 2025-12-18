// src/middlewares/error.middleware.js
import logger from "#config/logger.js";
import { ZodError } from "zod";

export default function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = "Internal server error";

  // ---------------- ZOD VALIDATION ERRORS ----------------
  if (err instanceof ZodError) {
    statusCode = 400;
    const errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(statusCode).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  // ---------------- OPERATIONAL ERRORS ----------------
  if (err.message) {
    message = err.message;
  }

  // ---------------- LOG ERROR ----------------
  logger.error("Request error", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    stack: err.stack,
  });

  // ---------------- RESPONSE ----------------
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
