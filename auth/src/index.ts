import mongoose from "mongoose";
import app from "./app";

async function bootstrap() {
  console.log("Starting up Auth Service...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth Service - listening on port 3000");
  });
}

bootstrap();
