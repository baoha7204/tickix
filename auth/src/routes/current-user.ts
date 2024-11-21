import express, { Request, Response } from "express";
import { currentUser } from "@bhtickix/common";

const router = express.Router();

router.get("/current-user", currentUser, (req: Request, res: Response) => {
  res.status(200).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
