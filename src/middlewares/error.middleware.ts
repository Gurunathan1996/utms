import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  const status = typeof err.status === "number" ? err.status : 400;
  res.status(status).json({ message: err.message ?? "Something went wrong" });
}
