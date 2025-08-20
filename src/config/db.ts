import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/user.entity.js";
import { Role } from "../models/role.entity.js";
import { Permission } from "../models/permission.entity.js";
import { RolePermission } from "../models/rolePermission.entity.js";
import { UserRole } from "../models/userRole.entity.js";
import { Ticket } from "../models/ticket.entity.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Role, Permission, RolePermission, UserRole, Ticket],
});
