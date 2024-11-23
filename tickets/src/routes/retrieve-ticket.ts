import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Retrieve all tickets");
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).send(`Retrieve ticket with id: ${id}`);
});

export { router as retrieveTicketRouter };
