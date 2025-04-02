import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { currentUser, NotFoundError, requireAuth } from "@bhtickix/common";

const router = express.Router();

router.get("/", async (_: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });
  res.status(200).send(tickets);
});

router.get(
  "/my-tickets",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({ userId: req.currentUser!.id });
    res.status(200).send(tickets);
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new NotFoundError("Ticket not found");
  res.status(200).send(ticket);
});

export { router as retrieveTicketRouter };
