import express from "express";

const router = express.Router();

router.post("/api/users/sign-in", (req, res) => {
  res.send("Sign in user");
});

export { router as signinRouter };