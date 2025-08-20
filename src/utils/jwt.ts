import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET ?? "";
let expiresIn: string | number = "1d";
if (process.env.JWT_EXPIRES_IN) {
  // If it's a number, use as number, else as string
  const num = Number(process.env.JWT_EXPIRES_IN);
  expiresIn = isNaN(num) ? process.env.JWT_EXPIRES_IN : num;
}

export function signJwt(payload: object) {
  const options: jwt.SignOptions = {};
  if (typeof expiresIn === "number") {
    options.expiresIn = expiresIn;
  } else if (typeof expiresIn === "string") {
    options.expiresIn = expiresIn as import("ms").StringValue;
  }
  return jwt.sign(payload, secret, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, secret) as T;
}
