import { OrderCancelledEvent, OrderStatus } from "@bhtickix/common";
import mongoose from "mongoose";
import { Order } from "../../../model/order";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";

describe("Order Cancelled Listener", () => {
  const setup = async () => {
    const order = Order.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 10,
      status: OrderStatus.Created,
    });

    await order.save();

    const listener = new OrderCancelledListener(natsWrapper.client);

    const data: OrderCancelledEvent["data"] = {
      id: order.id,
      version: order.version + 1,
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, order, msg };
  };

  it("Success - updates the status of the order", async () => {
    const { listener, data, order, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("Success - acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
