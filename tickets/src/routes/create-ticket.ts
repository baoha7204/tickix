import {
  currentUser,
  DatabaseConnectionError,
  requestValidation,
  requireAuth,
} from "@bhtickix/common";
import express, { Request, Response } from "express";

import { createTicketValidation } from "./validation";
import { Ticket } from "../models/ticket";

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

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
