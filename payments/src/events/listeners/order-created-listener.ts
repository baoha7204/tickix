import { Listener, OrderCreatedEvent, Subjects } from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Order } from "../../model/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, status, userId, version, ticket } = data;
    const order = Order.build({
      id,
      status,
      userId,
      version,
      price: ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
