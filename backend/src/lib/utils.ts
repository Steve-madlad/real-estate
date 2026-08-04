import type { NextFunction, Request, Response } from "express";
import { type ZodSafeParseResult } from "zod";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function catchAsync(fn: AsyncController) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export default function handleValidationError<T>(
  parsed: ZodSafeParseResult<T>,
  res: Response,
): asserts parsed is { success: true; data: T } {
  if (!parsed.success) {
    const issues = parsed.error.issues;
    const errors: Record<string, string> = {};

    if (issues.length > 1) {
      for (const issue of issues) {
        const field = issue.path[0];

        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      }
    }

    const errorsObjectEmpty = Object.keys(errors).length === 0;
    const firstIssue = issues[0];
    const firstErrorMessage =
      (errorsObjectEmpty
        ? firstIssue?.message?.replace("input", String(firstIssue?.path[0]))
        : firstIssue?.message) || "Invalid input";

    res.status(400).json({
      success: false,
      message: firstErrorMessage,
      errors,
    });
  }
}
