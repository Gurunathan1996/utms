// import { AppDataSource } from "../config/db.js";
// import { User } from "../models/user.entity.js";
// import { comparePassword, hashPassword } from "../utils/hash.js";
// import { signJwt } from "../utils/jwt.js";
// import { invalidateUserPermissions } from "./permission.service.js";

// export class AuthService {
//   private userRepo = AppDataSource.getRepository(User);

//   async register(name: string, email: string, password: string) {
//     const exists = await this.userRepo.findOne({ where: { email } });
//     if (exists) throw new Error("Email already in use");
//     const user = this.userRepo.create({
//       name,
//       email,
//       passwordHash: await hashPassword(password),
//       isActive: true,
//     });
//     const saved = await this.userRepo.save(user);
//     const token = signJwt({ sub: saved.id });
//     return {
//       user: { id: saved.id, name: saved.name, email: saved.email },
//       token,
//     };
//   }

//   async login(email: string, password: string) {
//     const user = await this.userRepo
//       .createQueryBuilder("user")
//       .addSelect("user.passwordHash")
//       .where("user.email = :email", { email })
//       .getOne();

//     if (!user || !user.passwordHash) throw new Error("Invalid credentials");
//     const ok = await comparePassword(password, user.passwordHash);
//     if (!ok) throw new Error("Invalid credentials");

//     const token = signJwt({ sub: user.id });
//     return { user: { id: user.id, name: user.name, email: user.email }, token };
//   }

//   async issueJwtForUser(userId: string) {
//     // Invalidate permission cache (fresh roles might be attached)
//     await invalidateUserPermissions(userId);
//     return signJwt({ sub: userId });
//   }
// }

import { AppDataSource } from "../config/db.js";
import { User } from "../models/user.entity.js";
import { ApiException } from "../utils/api-exception.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { invalidateUserPermissions } from "./permission.service.js";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  /**
   * Registers a new user with hashed password.
   */
  public async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    try {
      const exists = await this.userRepo.findOne({ where: { email } });
      if (exists) {
        throw new ApiException(409, "Email already in use");
      }

      const user = this.userRepo.create({
        name,
        email,
        passwordHash: await hashPassword(password),
        isActive: true,
      });

      const saved = await this.userRepo.save(user);
      const token = signJwt({ sub: saved.id });

      return {
        user: { id: saved.id, name: saved.name, email: saved.email },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logs in a user by validating email and password.
   */
  public async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    try {
      const user = await this.userRepo
        .createQueryBuilder("user")
        .addSelect("user.passwordHash")
        .where("user.email = :email", { email })
        .getOne();

      if (!user || !user.passwordHash) {
        throw new ApiException(401, "Invalid credentials");
      }

      const ok = await comparePassword(password, user.passwordHash);
      if (!ok) {
        throw new ApiException(401, "Invalid credentials");
      }

      const token = signJwt({ sub: user.id });
      return {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Issues a fresh JWT for a user and invalidates permission cache.
   */
  public async issueJwtForUser(userId: string): Promise<string> {
    try {
      await invalidateUserPermissions(userId);
      return signJwt({ sub: userId });
    } catch (error) {
      throw error;
    }
  }
}
