import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized-error";

// Pre-requisite: Need to run currentUser middleware before this middleware
export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
  if (!req.currentUser) throw new UnauthorizedError("User not authenticated");
  next();
};
