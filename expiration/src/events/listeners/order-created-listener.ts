import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@bhtickix/common";
import { QUEUE_GROUP_NAME } from "../../constants";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
     
  }
}
