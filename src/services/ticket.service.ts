// import { AppDataSource } from '../config/db.js';
// import { Ticket } from '../models/ticket.entity.js';
// import { User } from '../models/user.entity.js';
// import { CreateTicketDto, UpdateTicketDto } from '../dtos/ticket.dto.js';

// export class TicketService {
//   private ticketRepo = AppDataSource.getRepository(Ticket);
//   private userRepo = AppDataSource.getRepository(User);

//   async create(ownerId: string, dto: CreateTicketDto) {
//     const owner = await this.userRepo.findOneByOrFail({ id: ownerId });
//     const ticket = this.ticketRepo.create({ ...dto, owner });
//     return this.ticketRepo.save(ticket);
//   }

//   async findMy(ownerId: string) {
//     return this.ticketRepo.find({
//       where: [{ owner: { id: ownerId } }, { assignee: { id: ownerId } }],
//       order: { createdAt: 'DESC' }
//     });
//   }

//   async findByIdScoped(userId: string, id: string) {
//     const t = await this.ticketRepo.findOneOrFail({ where: { id } });
//     if (t.owner.id !== userId && t.assignee?.id !== userId) {
//       throw new Error('Not authorized to view this ticket');
//     }
//     return t;
//   }

//   async update(userId: string, id: string, dto: UpdateTicketDto) {
//     const t = await this.findByIdScoped(userId, id);

//     if (dto.assigneeId !== undefined) {
//       t.assignee = dto.assigneeId ? await this.userRepo.findOneByOrFail({ id: dto.assigneeId }) : null;
//     }
//     if (dto.title !== undefined) t.title = dto.title;
//     if (dto.description !== undefined) t.description = dto.description;
//     if (dto.status !== undefined) t.status = dto.status;
//     return this.ticketRepo.save(t);
//   }

//   async delete(userId: string, id: string) {
//     const t = await this.findByIdScoped(userId, id);
//     await this.ticketRepo.delete({ id: t.id });
//     return { deleted: true };
//   }
// }

import { AppDataSource } from "../config/db.js";
import { Ticket } from "../models/ticket.entity.js";
import { User } from "../models/user.entity.js";
import { CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto.js";
import { ApiException } from "../utils/api-exception.js";

export class TicketService {
  private ticketRepo = AppDataSource.getRepository(Ticket);
  private userRepo = AppDataSource.getRepository(User);

  /**
   * Creates a new ticket for the given owner.
   */
  public async create(ownerId: string, dto: CreateTicketDto) {
    try {
      const owner = await this.userRepo.findOneBy({ id: ownerId });
      if (!owner) {
        throw new ApiException(404, "Owner not found");
      }

      const ticket = this.ticketRepo.create({ ...dto, owner });
      return await this.ticketRepo.save(ticket);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds tickets where the user is the owner or assignee.
   */
  public async findMy(ownerId: string) {
    try {
      return await this.ticketRepo.find({
        where: [{ owner: { id: ownerId } }, { assignee: { id: ownerId } }],
        order: { createdAt: "DESC" },
      });
    } catch (error) {
      throw new ApiException(500, "Failed to fetch tickets");
    }
  }

  /**
   * Finds a ticket by ID, ensuring the user is either owner or assignee.
   */
  public async findByIdScoped(userId: string, id: string) {
    try {
      const t = await this.ticketRepo.findOne({
        where: { id },
        relations: ["owner", "assignee"],
      });

      if (!t) {
        throw new ApiException(404, "Ticket not found");
      }

      if (t.owner.id !== userId && t.assignee?.id !== userId) {
        throw new ApiException(403, "Not authorized to view this ticket");
      }

      return t;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(500, "Failed to fetch ticket");
    }
  }

  /**
   * Updates a ticket with new details.
   */
  public async update(userId: string, id: string, dto: UpdateTicketDto) {
    try {
      const t = await this.findByIdScoped(userId, id);

      if (dto.assigneeId !== undefined) {
        t.assignee = dto.assigneeId
          ? await this.userRepo.findOneByOrFail({ id: dto.assigneeId })
          : null;
      }
      if (dto.title !== undefined) t.title = dto.title;
      if (dto.description !== undefined) t.description = dto.description;
      if (dto.status !== undefined) t.status = dto.status;

      return await this.ticketRepo.save(t);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(400, "Failed to update ticket");
    }
  }

  /**
   * Deletes a ticket after checking ownership/assignment.
   */
  public async delete(userId: string, id: string) {
    try {
      const t = await this.findByIdScoped(userId, id);
      await this.ticketRepo.delete({ id: t.id });
      return { deleted: true };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(400, "Failed to delete ticket");
    }
  }
}
