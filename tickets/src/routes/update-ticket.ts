import express, { Request, Response } from "express";

const router = express.Router();

router.put("/", (req: Request, res: Response) => {
  res.status(200).send("Update ticket");
});

export { router as updateTicketRouter };
