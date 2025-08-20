import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "./userRole.entity.js";
import { RolePermission } from "./rolePermission.entity.js";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  code!: string; // e.g., 'ADMIN', 'MANAGER', 'USER'

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles!: UserRole[];

  @OneToMany(() => RolePermission, (rp) => rp.role)
  rolePermissions!: RolePermission[];
}
