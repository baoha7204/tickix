import { requireAuth } from "@bhtickix/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  res.send("Hello from retrieve-order");
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  res.send("Hello from retrieve-order");
});

export { router as retrieveOrderRouter };
