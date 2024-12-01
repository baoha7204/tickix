import {
  currentUser,
  DatabaseConnectionError,
  NotFoundError,
  requestValidation,
  requireAuth,
  UnauthorizedError,
} from "@bhtickix/common";
import express, { Request, Response } from "express";
import { createTicketValidation } from "./validation";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/:id",
  currentUser,
  requireAuth,
  createTicketValidation,
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError("Ticket not found");

    if (ticket.userId !== req.currentUser!.id)
      throw new UnauthorizedError(
        "User not authorized for updating this ticket"
      );

    if (ticket.orderId)
      throw new UnauthorizedError("User cannot edit a reserved ticket");

    ticket.set({ title, price });
    try {
      await ticket.save();
    } catch (error) {
      throw new DatabaseConnectionError();
    }

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
