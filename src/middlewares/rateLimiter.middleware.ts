import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();

const perIp = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "ratelimit:ip",
  points: Number(process.env.RATE_POINTS_PER_IP ?? 100),
  duration: Number(process.env.RATE_DURATION_PER_IP ?? 60),
});

const perUser = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "ratelimit:user",
  points: Number(process.env.RATE_POINTS_PER_USER ?? 200),
  duration: Number(process.env.RATE_DURATION_PER_USER ?? 60),
});

export async function rateLimitIp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await perIp.consume(req.ip ?? "unknown-ip");
    next();
  } catch {
    res.status(429).json({ message: "Too Many Requests (IP)" });
  }
}

// For authed routes; must run after requireAuth
export async function rateLimitUser(
  req: Request & { user?: { id: string } },
  res: Response,
  next: NextFunction
) {
  try {
    const key = req.user?.id ?? "anon";
    await perUser.consume(key);
    next();
  } catch {
    res.status(429).json({ message: "Too Many Requests (User)" });
  }
}
