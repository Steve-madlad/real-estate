import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Role, RoleList } from "../../types/index.js";
import { AppError } from "../lib/app-error.js";

interface DecodedToken extends JwtPayload {
  sub: string;
  "custom:role"?: string;
}

export function authMiddleWare(allowedRoles: RoleList) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      let decoded;
      try {
        decoded = jwt.decode(token) as DecodedToken;
      } catch (jwtErr) {
        throw new AppError("Unauthorized: Invalid or expired token", 401);
      }
      const userRole = decoded?.["custom:role"] as Role;

      if (!userRole) throw new AppError("Unauthorized: Access Denied", 403);

      req.user = {
        id: decoded.sub,
        role: userRole,
      };

      const hasAccess = allowedRoles.includes(userRole);

      if (!hasAccess) throw new AppError("Unauthorized: Access Denied", 403);

      next();
    } catch (error) {
      next(error);
    }
  };
}
