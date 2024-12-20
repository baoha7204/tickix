import {
  ExpirationCompleteEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new NotFoundError("Order not found");

    if (
      order.status === OrderStatus.Created ||
      order.status === OrderStatus.AwaitingPayment
    ) {
      order.set({ status: OrderStatus.Cancelled });
      await order.save();
      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
    }
    msg.ack();
  }
}
