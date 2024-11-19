import { body } from "express-validator";

export const signupValidation = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const signinValidation = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password must be provided"),
];
