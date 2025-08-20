import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity.js";
import { Role } from "./role.entity.js";

@Entity()
@Unique(["user", "role"])
export class UserRole {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => User, (u) => u.userRoles, {
    eager: true,
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Role, (r) => r.userRoles, {
    eager: true,
    onDelete: "CASCADE",
  })
  role!: Role;
}
