import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@bhtickix/common";

import { retrieveTicketRouter } from "./routes/retrieve-ticket";
import { updateTicketRouter } from "./routes/update-ticket";
import { createTicketRouter } from "./routes/create-ticket";

const prefix = "/api/tickets";
const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(prefix, retrieveTicketRouter);
app.use(prefix, createTicketRouter);
app.use(prefix, updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export default app;
