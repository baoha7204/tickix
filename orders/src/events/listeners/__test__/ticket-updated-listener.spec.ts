import { TicketUpdatedEvent } from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";

describe("Ticket Updated Listener", () => {
  const setup = async () => {
    // Create and save a ticket
    const ticket = Ticket.build({
      title: "concert",
      price: 10,
    });
    await ticket.save();
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create a fake data event
    const data: TicketUpdatedEvent["data"] = {
      id: ticket.id,
      version: ticket.version + 1,
      title: "new concert",
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
  it("Success - find, update, save a ticket", async () => {
    const { listener, data, msg } = await setup();
    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it("Success - ack the message", async () => {
    // Call onMessage function with the data object + message object
    const { listener, data, msg } = await setup();
    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
  });

  it("Failed - out of order version number", async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;
    try {
      await listener.onMessage(data, msg);
    } catch (err) {
      expect(err).toBeDefined();
    }
    expect(msg.ack).not.toHaveBeenCalled();
  });
});
