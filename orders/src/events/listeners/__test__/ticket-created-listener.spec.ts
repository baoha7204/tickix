import { TicketCreatedEvent } from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

describe("Ticket Created Listener", () => {
  const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // Create a fake data event
    const data: TicketCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      title: "concert",
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
    };
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };
  it("Success - create and save a ticket", async () => {
    const { listener, data, msg } = await setup();
    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  it("Success - ack the message", async () => {
    // Call onMessage function with the data object + message object
    const { listener, data, msg } = await setup();
    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
  });
});
