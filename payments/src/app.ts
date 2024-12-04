import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
  requireAuth,
} from "@bhtickix/common";

const prefix = "/api/tickets";
const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUser);
app.use(requireAuth);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export default app;
