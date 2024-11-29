import express, { Request, Response } from "express";

import { Order } from "../models/order";
import { NotFoundError, UnauthorizedError } from "@bhtickix/common";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

router.get("/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) throw new NotFoundError("Order not found");

  if (order.userId !== req.currentUser!.id)
    throw new UnauthorizedError("Unauthorized access to this order");

  res.send(order);
});

export { router as retrieveOrderRouter };
