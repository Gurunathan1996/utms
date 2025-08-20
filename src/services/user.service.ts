// import { AppDataSource } from '../config/db.js';
// import { User } from '../models/user.entity.js';
// import { UpdateMeDto } from '../dtos/user.dto.js';

// export class UserService {
//   private repo = AppDataSource.getRepository(User);

//   getMe(userId: string) {
//     return this.repo.findOneByOrFail({ id: userId });
//   }

//   async updateMe(userId: string, dto: UpdateMeDto) {
//     await this.repo.update({ id: userId }, dto);
//     return this.getMe(userId);
//   }

//   async listUsers() {
//     return this.repo.find();
//   }
// }

// src/services/user.service.ts

import { AppDataSource } from "../config/db.js";
import { User } from "../models/user.entity.js";
import { UpdateMeDto } from "../dtos/user.dto.js";
import { Repository } from "typeorm";

export class UserService {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  /**
   * Get logged-in user by ID
   */
  async getMe(userId: string): Promise<User | null> {
    try {
      return await this.repo.findOne({
        where: { id: userId },
      });
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  }

  /**
   * Update logged-in user profile
   */
  async updateMe(userId: string, dto: UpdateMeDto): Promise<User> {
    try {
      const user = await this.repo.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error("User not found");
      }

      // Merge dto values into user entity
      this.repo.merge(user, dto);

      return await this.repo.save(user);
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  /**
   * List all users (admin use)
   */
  async listUsers(): Promise<User[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }
}
