import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/app-error.js";

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";
  let success = false;
  let errors: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    success = err.success;
    errors = err.errors;
  } else {
    console.error("💥 UNHANDLED ERROR:", err);

    if (process.env.NODE_ENV === "development") {
      message = err.message || message;
    }
  }

  return res.status(statusCode).json({
    success,
    status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}