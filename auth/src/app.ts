import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler, NotFoundError } from "@bhtickix/common";

const prefix = "/api/users";
const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(prefix, currentUserRouter);
app.use(prefix, signinRouter);
app.use(prefix, signoutRouter);
app.use(prefix, signupRouter);

app.all("*", async () => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export default app;
