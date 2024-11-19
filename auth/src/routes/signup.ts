import express, { Request, Response } from "express";

import { signupValidation } from "./validation";

import { User } from "../models/user";

import { requestValidation } from "../middlewares/request-validation";

import { DatabaseConnectionError } from "../errors/database-connection-error";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/sign-up",
  signupValidation,
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new BadRequestError("Email already in use");
    }

    // Create a new user
    const user = User.build({ email, password });
    try {
      await user.save();
    } catch (err) {
      throw new DatabaseConnectionError();
    }

    res.status(201).send(user);
  }
);

export { router as signupRouter };
