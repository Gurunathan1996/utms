import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { getUserPermissions } from "../services/permission.service.js";

export function requirePermissions(...need: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id)
        return res.status(401).json({ message: "Unauthorized" });
      const perms = await getUserPermissions(req.user.id);
      const ok = need.every((n) => perms.includes(n));
      if (!ok) return res.status(403).json({ message: "Forbidden" });
      req.user.permissions = perms;
      next();
    } catch (e) {
      next(e);
    }
  };
}
