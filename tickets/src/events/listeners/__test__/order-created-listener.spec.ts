import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@bhtickix/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

describe("Order Created Listener", () => {
  const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
      title: "concert",
      price: 99,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    // Create a fake data event
    const data: OrderCreatedEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: ticket.version,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: "asdasd",
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
  };

  it("Success - update the ticket with the orderId", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  it("Success - ack the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("Success - publish a ticket updated event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedData.orderId).toEqual(data.id);
  });
});
