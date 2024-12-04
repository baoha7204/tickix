import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { id, version } = data;
    const order = await Order.findByEvent({
      id,
      version,
    });

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
