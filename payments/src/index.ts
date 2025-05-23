import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

async function bootstrap() {
  console.log("Starting up Payments Service...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.STRIPE_KEY) throw new Error("STRIPE_KEY must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    const client = natsWrapper.client;
    client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => client.close());
    process.on("SIGTERM", () => client.close());

    new OrderCreatedListener(client).listen();
    new OrderCancelledListener(client).listen();
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Tickets Service - listening on port 3000");
  });
}

bootstrap();
