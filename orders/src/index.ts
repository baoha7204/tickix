import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";

async function bootstrap() {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

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

    new TicketCreatedListener(client).listen();
    new TicketUpdatedListener(client).listen();
    new ExpirationCompleteListener(client).listen();
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Payments Service - listening on port 3000");
  });
}

bootstrap();
