import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@bhtickix/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) throw new NotFoundError("Order not found");

  if (order.userId !== req.currentUser!.id)
    throw new UnauthorizedError("Unauthorized access to this order");

  order.status = OrderStatus.Cancelled;

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });

  await order.save();

  res.status(204).send(order);
});

export { router as cancelOrderRouter };
