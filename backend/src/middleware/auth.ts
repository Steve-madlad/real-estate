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

export function authMiddleWare(allowedRoles: RoleList) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new AppError("Unauthorized: Missing token", 401);
    }

    let payload;

    try {
      payload = await idVerifier.verify(token);
    } catch {
      throw new AppError("Could not verify token", 401);
    }

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
  };
}
