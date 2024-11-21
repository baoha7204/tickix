import express, { Request, Response } from "express";

import { signupValidation } from "./validation";

import { User } from "../models/user";

import {
  DatabaseConnectionError,
  BadRequestError,
  requestValidation,
} from "@bhtickix/common";

const router = express.Router();

router.post(
  "/sign-up",
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
