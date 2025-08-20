// import { Response } from 'express';
// import { plainToInstance } from 'class-transformer';
// import { validateOrReject } from 'class-validator';
// import { CreateTicketDto, UpdateTicketDto } from '../dtos/ticket.dto.js';
// import { TicketService } from '../services/ticket.service.js';
// import { AuthRequest } from '../middlewares/auth.middleware.js';

// const service = new TicketService();

// export async function createTicket(req: AuthRequest, res: Response) {
//   const dto = plainToInstance(CreateTicketDto, req.body);
//   await validateOrReject(dto);
//   const created = await service.create(req.user!.id, dto);
//   res.status(201).json(created);
// }

// export async function listMyTickets(req: AuthRequest, res: Response) {
//   const items = await service.findMy(req.user!.id);
//   res.json(items);
// }

// export async function getTicket(req: AuthRequest, res: Response) {
//   const t = await service.findByIdScoped(req.user!.id, req.params.id);
//   res.json(t);
// }

// export async function updateTicket(req: AuthRequest, res: Response) {
//   const dto = plainToInstance(UpdateTicketDto, req.body);
//   await validateOrReject(dto);
//   const updated = await service.update(req.user!.id, req.params.id, dto);
//   res.json(updated);
// }

// export async function deleteTicket(req: AuthRequest, res: Response) {
//   const result = await service.delete(req.user!.id, req.params.id);
//   res.json(result);
// }

import { Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto.js";
import { TicketService } from "../services/ticket.service.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { ApiException } from "../utils/api-exception.js";

const service = new TicketService();

/**
 * Create a new ticket for the authenticated user.
 */
export async function createTicket(req: AuthRequest, res: Response) {
  try {
    const dto = plainToInstance(CreateTicketDto, req.body);
    await validateOrReject(dto);

    const created = await service.create(req.user!.id, dto);
    return res.status(201).json(created);
  } catch (error: any) {
    throw new ApiException(400, error.message || "Failed to create ticket");
  }
}

/**
 * List all tickets belonging to the authenticated user.
 */
export async function listMyTickets(req: AuthRequest, res: Response) {
  try {
    const items = await service.findMy(req.user!.id);
    return res.json(items);
  } catch (error: any) {
    throw new ApiException(500, error.message || "Failed to fetch tickets");
  }
}

/**
 * Get a single ticket (scoped to the authenticated user).
 */
export async function getTicket(req: AuthRequest, res: Response) {
  try {
    const ticket = await service.findByIdScoped(req.user!.id, req.params.id);
    if (!ticket) {
      throw new ApiException(404, "Ticket not found");
    }
    return res.json(ticket);
  } catch (error: any) {
    if (error instanceof ApiException) throw error;
    throw new ApiException(500, error.message || "Failed to fetch ticket");
  }
}

/**
 * Update an existing ticket for the authenticated user.
 */
export async function updateTicket(req: AuthRequest, res: Response) {
  try {
    const dto = plainToInstance(UpdateTicketDto, req.body);
    await validateOrReject(dto);

    const updated = await service.update(req.user!.id, req.params.id, dto);
    return res.json(updated);
  } catch (error: any) {
    throw new ApiException(400, error.message || "Failed to update ticket");
  }
}

/**
 * Delete a ticket belonging to the authenticated user.
 */
export async function deleteTicket(req: AuthRequest, res: Response) {
  try {
    const result = await service.delete(req.user!.id, req.params.id);
    return res.json(result);
  } catch (error: any) {
    throw new ApiException(400, error.message || "Failed to delete ticket");
  }
}
