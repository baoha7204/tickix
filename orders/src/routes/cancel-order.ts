import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
} from "@bhtickix/common";

const router = express.Router();

router.delete("/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new NotFoundError("Order not found");

  if (order.userId !== req.currentUser!.id)
    throw new UnauthorizedError("Unauthorized access to this order");

  order.status = OrderStatus.Cancelled;

  await order.save();

  res.status(204).send(order);
});

export { router as cancelOrderRouter };
