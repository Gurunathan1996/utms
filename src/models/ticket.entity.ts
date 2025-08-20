import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User } from "./user.entity.js";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 20, default: "OPEN" })
  @Index()
  status!: TicketStatus;

  @ManyToOne(() => User, (u) => u.ownedTickets, {
    eager: true,
    onDelete: "CASCADE",
  })
  owner!: User; // creator

  @ManyToOne(() => User, (u) => u.assignedTickets, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  assignee!: User | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
