import express, { Request, Response } from "express";
import { signupValidation } from "./validation";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const router = express.Router();

router.post(
  "/api/users/sign-up",
  signupValidation,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    throw new DatabaseConnectionError();

    res.send({ email, password });
  }
);

export { router as signupRouter };
