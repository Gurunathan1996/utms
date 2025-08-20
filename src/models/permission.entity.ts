import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolePermission } from "./rolePermission.entity.js";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  code!: string; // e.g., 'ticket.read', 'ticket.create', 'user.read'

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];
}
