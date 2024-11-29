import { requireAuth } from "@bhtickix/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  res.send("Hello from cancel-order");
});

export { router as cancelOrderRouter };
