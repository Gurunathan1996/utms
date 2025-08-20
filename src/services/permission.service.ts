import { AppDataSource } from "../config/db.js";
import { Permission } from "../models/permission.entity.js";
import { RolePermission } from "../models/rolePermission.entity.js";
import { UserRole } from "../models/userRole.entity.js";
import { redis } from "../config/redis.js";

const KEY = (userId: string) => `rbac:perms:${userId}`;

export async function getUserPermissions(userId: string): Promise<string[]> {
  const cached = await redis.get(KEY(userId));
  if (cached) return JSON.parse(cached);

  const userRoles = await AppDataSource.getRepository(UserRole).find({
    where: { user: { id: userId } },
    relations: { role: true },
  });

  if (!userRoles.length) {
    await redis.setex(KEY(userId), 300, JSON.stringify([]));
    return [];
  }

  const roleIds = userRoles.map((ur) => ur.role.id);

  const rolePerms = await AppDataSource.getRepository(RolePermission).find({
    where: roleIds.map((id) => ({ role: { id } })),
    relations: { permission: true },
  });

  const perms = Array.from(new Set(rolePerms.map((rp) => rp.permission.code)));
  await redis.setex(KEY(userId), 300, JSON.stringify(perms));
  return perms;
}

export async function invalidateUserPermissions(userId: string) {
  await redis.del(KEY(userId));
}

export async function ensureBasePermissions() {
  // Seed a minimal set if empty (idempotent)
  const permRepo = AppDataSource.getRepository(Permission);
  const count = await permRepo.count();
  if (count > 0) return;

  const base = [
    { code: "user.read", description: "Read users" },
    { code: "user.update", description: "Update users" },
    { code: "ticket.create", description: "Create tickets" },
    { code: "ticket.read", description: "Read tickets" },
    { code: "ticket.update", description: "Update tickets" },
    { code: "ticket.delete", description: "Delete tickets" },
  ];
  await permRepo.save(base);
}
