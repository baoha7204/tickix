import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { signupValidation } from "./validation";

import { User } from "../models/user";

import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../utils/password";

const router = express.Router();

router.post(
  "/api/users/sign-up",
  signupValidation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
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

    // Generate JWT abd store it in the session object
    const userPayload = {
      id: user.id,
      email: user.email,
    };
    const userJwt = jwt.sign(userPayload, "so-sad");
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
