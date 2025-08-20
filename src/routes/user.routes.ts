import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { rateLimitUser } from "../middlewares/rateLimiter.middleware.js";
import { getMe, listUsers, updateMe } from "../controllers/user.controller.js";
import { requirePermissions } from "../middlewares/rbac.middleware.js";

const router = Router();

router.get("/me", requireAuth, rateLimitUser, getMe);
router.put("/me", requireAuth, rateLimitUser, updateMe);

// Example admin-only list (requires RBAC)
router.get(
  "/",
  requireAuth,
  rateLimitUser,
  requirePermissions("user.read"),
  listUsers
);

export default router;
