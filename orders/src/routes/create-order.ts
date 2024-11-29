import { requestValidation, requireAuth } from "@bhtickix/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/:id",
  requireAuth,
  [
    body("ticketId")
      .trim()
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket ID is required"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    res.send("Hello from create-order");
  }
);

export { router as createOrderRouter };
