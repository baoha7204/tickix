import { requestValidation, requireAuth } from "@bhtickix/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/:id",
  requireAuth,
  [body("ticketId")],
  requestValidation,
  async (req: Request, res: Response) => {
    res.send("Hello from create-order");
  }
);

export { router as createOrderRouter };
