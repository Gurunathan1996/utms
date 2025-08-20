import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import "express-async-errors";

import { AppDataSource } from "./config/db.js";
import { redis } from "./config/redis.js";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { rateLimitIp, rateLimitUser } from "./middlewares/rateLimiter.middleware.js";
import { ensureBasePermissions } from "./services/permission.service.js";
import { requireAuth } from "./middlewares/auth.middleware.js";

dotenv.config();

async function bootstrap() {
  await AppDataSource.initialize();
  await ensureBasePermissions(); 

  const app = express();
  const port = Number(process.env.PORT ?? 4000);

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? true, credentials: true }));
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(rateLimitIp);
  app.use(passport.initialize());

  app.get("/api/health", async (_req, res) => {
    const pong = await redis.ping();
    res.json({ ok: true, redis: pong === "PONG" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", requireAuth, rateLimitUser, userRoutes);
  app.use("/api/tickets", ticketRoutes);

  app.use(errorHandler);

  app.listen(port, () =>
    console.log(`UTMS API running on http://localhost:${port}`)
  );
}

bootstrap().catch((e) => {
  console.error("Failed to start app", e);
  process.exit(1);
});
