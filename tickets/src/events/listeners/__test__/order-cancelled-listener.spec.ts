import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@bhtickix/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

describe("Order Cancelled Listener", () => {
  const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
      title: "concert",
      price: 99,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create a fake data event
    const data: OrderCancelledEvent["data"] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: ticket.version,
      ticket: {
        id: ticket.id,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, ticket, data, msg };
  };

  it("Success - update the ticket with the orderId undefined", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
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

    expect(ticketUpdatedData.orderId).toBeUndefined();
  });
});
