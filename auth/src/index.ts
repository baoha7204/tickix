import express from "express";
import { json } from "body-parser";

const app = express();

app.use(json());

app.get("/api/users", (req, res) => {
  res.send("Fetch all users");
});

app.get("/api/users/current-user", (req, res) => {
  res.send("Fetch single user");
});

app.listen(3000, () => {
  console.log("Auth Service - listening on port 3000");
});
