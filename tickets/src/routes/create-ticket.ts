import {
  currentUser,
  DatabaseConnectionError,
  requestValidation,
  requireAuth,
} from "@bhtickix/common";
import express, { Request, Response } from "express";

import { createTicketValidation } from "./validation";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/",
  currentUser,
  requireAuth,
  createTicketValidation,
  requestValidation,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    try {
      await ticket.save();
    } catch (err) {
      throw new DatabaseConnectionError();
    }

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
