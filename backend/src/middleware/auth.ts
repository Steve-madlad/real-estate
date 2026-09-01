import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { NextFunction, Request, Response } from "express";
import type { Role, RoleList } from "../../types/index.js";
import { AppError } from "../lib/app-error.js";

if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

const idVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_CLIENT_ID,
});

const accessVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

export function authMiddleWare(allowedRoles: RoleList) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return next(new AppError("Unauthorized: Missing token", 401));
    }

    try {
      const payload = await (async () => {
        try {
          return await idVerifier.verify(token);
        } catch {
          return await accessVerifier.verify(token);
        }
      })();

      const userRole = (payload["custom:role"] ??
        payload["cognito:groups"]) as Role;

      if (!userRole) {
        throw new AppError("Forbidden: Access Denied", 403);
      }

      if (!allowedRoles.includes(userRole)) {
        throw new AppError("Forbidden: Insufficient privileges", 403);
      }

      if (!payload.sub) {
        throw new AppError("Unauthorized: User Id missing from token", 401);
      }

      req.user = {
        id: payload.sub,
        role: userRole,
      };

      next();
    } catch (error) {
      console.log({ error });
      next(new AppError("Unauthorized: Invalid or expired token", 401));
    }
  };
}
