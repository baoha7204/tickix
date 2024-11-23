import { body } from "express-validator";

export const createTicketValidation = [
  body("title").trim().not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
];
