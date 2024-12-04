import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@bhtickix/common";
import { param } from "express-validator";
import mongoose from "mongoose";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/:id",
  [
    param("id")
      .trim()
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Order ID is required"),
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) throw new NotFoundError("Order not found");

    if (order.userId !== req.currentUser!.id)
      throw new UnauthorizedError("Unauthorized access to this order");

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Order already cancelled");

    order.status = OrderStatus.Cancelled;

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    await order.save();

    res.status(204).send(order);
  }
);

export { router as cancelOrderRouter };
