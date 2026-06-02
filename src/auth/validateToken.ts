import { Request, Response, NextFunction } from "express";
import { JWT, TokenPayload } from "../libs/token";
import { Exception } from "../libs/exceptionHandler";
import { environment } from "../config/env.config";

const accessType = {
  ACCESS: environment.JWT_ACCESS_SECRET_KEY,
};

interface ValidationOptions {
  checkAdmin?: boolean;
  checkDocter?: boolean;
  checkPatient?: boolean;
  checkContentManager?: boolean;
}

export const validateToken = (options: ValidationOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Exception("Authorization header missing", 401);

      const token = authHeader.replace("Bearer ", "");
      if (!token) throw new Exception("Token missing", 401);

      // Verify token
      const decoded = JWT.verify<TokenPayload>(
        token,
        accessType["ACCESS"] as string,
      );
      if (!decoded) throw new Exception("Invalid token", 401);

      // Attach decoded payload to request
      req.tokenPayload = decoded;

      // Role-based validation — if multiple flags set, any matching role is allowed
      const { role } = decoded;
      const { checkAdmin, checkDocter, checkPatient, checkContentManager } = options;

      const allowedRoles: string[] = [];
      if (checkAdmin)     allowedRoles.push("ADMIN");
      if (checkDocter)    allowedRoles.push("DOCTOR");
      if (checkPatient)   allowedRoles.push("PATIENT");
      if (checkContentManager) allowedRoles.push("CONTENT_MANAGER");

      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        const label = allowedRoles.length === 1
          ? allowedRoles[0].toLowerCase()
          : allowedRoles.map(r => r.toLowerCase()).join(" or ");
        throw new Exception(`Not authorized as ${label}`, 403);
      }

      next();
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  };
};
