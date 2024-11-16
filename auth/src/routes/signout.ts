import express from "express";

const router = express.Router();

router.post("/api/users/sign-out", (req, res) => {
  res.send("Sign out user");
});

export { router as signoutRouter };
