import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requestValidation,
  UnauthorizedError,
} from "@bhtickix/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../model/order";
import { stripe } from "../stripe";
import { Charge } from "../model/charge";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/",
  [
    body("token").trim().not().isEmpty(),
    body("orderId")
      .trim()
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Order ID is required"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError("Order not found");

    if (order.userId !== req.currentUser!.id)
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Order has been cancelled");

    const stripeRes = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    const charge = Charge.build({
      order: order,
      stripeId: stripeRes.id,
    });
    await charge.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: charge.id,
      orderId: order.id,
      stripeId: charge.stripeId,
    });

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
