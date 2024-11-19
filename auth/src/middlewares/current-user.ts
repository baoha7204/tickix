import { NextFunction, Request, Response } from "express";

import { Jwt } from "../utils/jwt";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = Jwt.verify(req.session.jwt) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};
