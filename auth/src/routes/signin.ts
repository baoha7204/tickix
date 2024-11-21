import express, { Request, Response } from "express";

import { signinValidation } from "./validation";

import { User } from "../models/user";

import {
  requestValidation,
  BadRequestError,
  Password,
  Jwt,
} from "@bhtickix/common";

const router = express.Router();

router.post(
  "/sign-in",
  signinValidation,
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      throw new BadRequestError("Email not found");
    }

    // Compare passwords
    const passwordMatch = await Password.compare(
      existedUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT and store it in the session object
    const userPayload = {
      id: existedUser.id,
      email: existedUser.email,
    };
    const userJwt = Jwt.sign(userPayload);
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existedUser);
  }
);

export { router as signinRouter };
