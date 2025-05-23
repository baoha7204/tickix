import express, { Request, Response } from "express";

import { Order } from "../models/order";
import {
  NotFoundError,
  requestValidation,
  UnauthorizedError,
} from "@bhtickix/common";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

router.get(
  "/:id",
  [
    param("id")
      .trim()
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Order ID is required"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");

    if (!order) throw new NotFoundError("Order not found");

    if (order.userId !== req.currentUser!.id)
      throw new UnauthorizedError("Unauthorized access to this order");

    res.send(order);
  }
);

export { router as retrieveOrderRouter };
