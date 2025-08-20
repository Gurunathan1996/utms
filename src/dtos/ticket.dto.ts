// import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";
// import { TicketStatus } from "../models/ticket.entity.js";

// export class CreateTicketDto {
//   @IsString() title!: string;
//   @IsOptional() @IsString() description?: string;
// }

// export class UpdateTicketDto {
//   @IsOptional() @IsString() title?: string;
//   @IsOptional() @IsString() description?: string;
//   @IsOptional()
//   @IsIn(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
//   status?: TicketStatus;
//   @IsOptional() @IsUUID() assigneeId?: string | null;
// }



import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  IsNotEmpty,
} from "class-validator";
import { TicketStatus } from "../models/ticket.entity.js";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
  status?: TicketStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;
}
