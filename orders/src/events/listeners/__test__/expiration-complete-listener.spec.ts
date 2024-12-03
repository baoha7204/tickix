import { ExpirationCompleteEvent, OrderStatus } from "@bhtickix/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

describe("Expiration Complete Listener", () => {
  const setup = async () => {
    // Create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });

    await ticket.save();

    // Create and save an order
    const order = Order.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      expiresAt: new Date(),
      ticket,
    });

    await order.save();
    // Create a fake data event
    const data: ExpirationCompleteEvent["data"] = {
      orderId: order.id,
    };
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, order, msg };
  };

  it("Success - update the order status to cancelled", async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("Success - publish an order cancelled event", async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);
    expect(eventData.ticket.id).toEqual(order.ticket.id);
    expect(eventData.version).toEqual(order.version + 1);
  });

  it("Success - ack the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
