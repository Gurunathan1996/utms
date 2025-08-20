// import { Request, Response } from 'express';
// import { plainToInstance } from 'class-transformer';
// import { validateOrReject } from 'class-validator';
// import { RegisterDto, LoginDto } from '../dtos/auth.dto.js';
// import { AuthService } from '../services/auth.service.js';
// import { signJwt } from '../utils/jwt.js';

// const authService = new AuthService();

// export async function register(req: Request, res: Response) {
//   const dto = plainToInstance(RegisterDto, req.body);
//   await validateOrReject(dto);
//   const result = await authService.register(dto.name, dto.email, dto.password);
//   res.status(201).json(result);
// }

// export async function login(req: Request, res: Response) {
//   const dto = plainToInstance(LoginDto, req.body);
//   await validateOrReject(dto);
//   const result = await authService.login(dto.email, dto.password);
//   res.json(result);
// }

// // Called by passport strategies (no sessions). The user object is placed by passport into req.user
// export function oauthSuccess(req: Request & { user?: any }, res: Response) {
//   if (!req.user) return res.status(400).json({ message: 'OAuth failed' });
//   const token = signJwt({ sub: req.user.id });
//   // You can change this to redirect your frontend with the token in a query param or fragment
//   res.json({ token, user: { id: req.user.id, name: req.user.name, email: req.user.email } });
// }

import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { RegisterDto, LoginDto } from "../dtos/auth.dto.js";
import { AuthService } from "../services/auth.service.js";
import { signJwt } from "../utils/jwt.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiException } from "../utils/api-exception.js";
import { UnhandledException } from "../utils/unhandled-exception.js";

const authService = new AuthService();

/**
 * Register new user
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = plainToInstance(RegisterDto, req.body);
    await validateOrReject(dto);

    const result = await authService.register(
      dto.name,
      dto.email,
      dto.password
    );

    res
      .status(201)
      .json(
        new ApiResponse(201, { data: result }, "User registered successfully")
      );
  } catch (e) {
    if (e instanceof ApiException) {
      next(e);
    } else {
      next(new UnhandledException(e));
    }
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = plainToInstance(LoginDto, req.body);
    await validateOrReject(dto);

    const result = await authService.login(dto.email, dto.password);

    res
      .status(200)
      .json(new ApiResponse(200, { data: result }, "Login successful"));
  } catch (e) {
    if (e instanceof ApiException) {
      next(e);
    } else {
      next(new UnhandledException(e));
    }
  }
}

/**
 * OAuth success (Google, GitHub, Facebook)
 */
export function oauthSuccess(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiException(400, "OAuth failed");
    }

    const token = signJwt({ sub: req.user.id });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
          },
        },
        "OAuth login successful"
      )
    );
  } catch (e) {
    if (e instanceof ApiException) {
      next(e);
    } else {
      next(new UnhandledException(e));
    }
  }
}
