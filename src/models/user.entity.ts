import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserRole } from "./userRole.entity.js";
import { Ticket } from "./ticket.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  name!: string | null;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, select: false })
  passwordHash!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  oauthProvider!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  oauthId!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles!: UserRole[];

  @OneToMany(() => Ticket, (t) => t.owner)
  ownedTickets!: Ticket[];

  @OneToMany(() => Ticket, (t) => t.assignee)
  assignedTickets!: Ticket[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
