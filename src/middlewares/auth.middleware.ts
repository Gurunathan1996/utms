import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

interface User {
  id: string;
  permissions?: string[];
  // add other user properties if needed
}

// Extend Express.User to match your User interface
declare global {
  namespace Express {
    interface User {
      id: string;
      permissions?: string[];
      // add other user properties if needed
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = header.split(" ")[1];
  try {
    const payload = verifyJwt<{ sub: string }>(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
