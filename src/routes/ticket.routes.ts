import { Router } from "express";
import { requirePermissions } from "../middlewares/rbac.middleware.js";
import {
  createTicket,
  deleteTicket,
  getTicket,
  listMyTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { rateLimitUser } from "../middlewares/rateLimiter.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  rateLimitUser,
  requirePermissions("ticket.create"),
  createTicket
);
router.get(
  "/",
  requireAuth,
  rateLimitUser,
  requirePermissions("ticket.read"),
  listMyTickets
);
router.get(
  "/:id",
  requireAuth,
  rateLimitUser,
  requirePermissions("ticket.read"),
  getTicket
);
router.put(
  "/:id",
  requireAuth,
  rateLimitUser,
  requirePermissions("ticket.update"),
  updateTicket
);
router.delete(
  "/:id",
  requireAuth,
  rateLimitUser,
  requirePermissions("ticket.delete"),
  deleteTicket
);

export default router;
