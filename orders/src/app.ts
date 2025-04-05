import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  currentUser,
  errorHandler,
  NotFoundError,
  requireAuth,
} from "@bhtickix/common";

import { retrieveOrderRouter } from "./routes/retrieve-order";
import { cancelOrderRouter } from "./routes/cancel-order";
import { createOrderRouter } from "./routes/create-order";

const prefix = "/api/orders";
const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
    secure: false,
  })
);

app.use(currentUser);
app.use(requireAuth);
app.use(prefix, retrieveOrderRouter);
app.use(prefix, cancelOrderRouter);
app.use(prefix, createOrderRouter);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export default app;
