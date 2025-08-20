// import { Response } from 'express';
// import { plainToInstance } from 'class-transformer';
// import { validateOrReject } from 'class-validator';
// import { UpdateMeDto } from '../dtos/user.dto.js';
// import { UserService } from '../services/user.service.js';
// import { AuthRequest } from '../middlewares/auth.middleware.js';

// const service = new UserService();

// export async function getMe(req: AuthRequest, res: Response) {
//   const me = await service.getMe(req.user!.id);
//   res.json(me);
// }

// export async function updateMe(req: AuthRequest, res: Response) {
//   const dto = plainToInstance(UpdateMeDto, req.body);
//   await validateOrReject(dto);
//   const me = await service.updateMe(req.user!.id, dto);
//   res.json(me);
// }

// export async function listUsers(_req: AuthRequest, res: Response) {
//   const users = await service.listUsers();
//   res.json(users);
// }

// src/controllers/user.controller.ts

import { Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UpdateMeDto } from "../dtos/user.dto.js";
import { UserService } from "../services/user.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

const userService = new UserService();

/**
 * Get logged-in user profile
 */
export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const me = await userService.getMe(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(me);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user", error });
  }
}

/**
 * Update logged-in user profile
 */
export async function updateMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const dto = plainToInstance(UpdateMeDto, req.body);
    await validateOrReject(dto);

    const updatedUser = await userService.updateMe(req.user.id, dto);
    return res.json(updatedUser);
  } catch (error) {
    if (Array.isArray(error)) {
      // Validation errors
      return res.status(400).json({
        message: "Validation failed",
        errors: error.map((e) => e.toString()),
      });
    }
    return res.status(500).json({ message: "Failed to update user", error });
  }
}

/**
 * List all users (admin use)
 */
export async function listUsers(_req: AuthRequest, res: Response) {
  try {
    const users = await userService.listUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
}
