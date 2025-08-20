import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { Role } from "./role.entity.js";
import { Permission } from "./permission.entity.js";

@Entity()
@Unique(["role", "permission"])
export class RolePermission {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => Role, (r) => r.rolePermissions, {
    eager: true,
    onDelete: "CASCADE",
  })
  role!: Role;

  @ManyToOne(() => Permission, (p) => p.rolePermissions, {
    eager: true,
    onDelete: "CASCADE",
  })
  permission!: Permission;
}
