import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "./app-error.js";

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
  parsed: ReturnType<z.ZodType<T>["safeParse"]>,
): asserts parsed is { success: true; data: T } {
  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstIssue = issues[0];

    let errorsMap: Record<string, string> | undefined = undefined;

    if (issues.length > 1) {
      const map: Record<string, string> = {};

      for (const issue of issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !map[field]) {
          map[field] = issue.message;
        }
      }

      if (Object.keys(map).length > 0) {
        errorsMap = map;
      }
    }

    const firstErrorMessage =
      firstIssue?.message?.replace(
        "input",
        String(firstIssue?.path[0] ?? "field"),
      ) || "Invalid input";

    throw new AppError(firstErrorMessage, 400, errorsMap);
  }
}
