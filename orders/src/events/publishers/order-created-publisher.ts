import { OrderCreatedEvent, Publisher, Subjects } from "@bhtickix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
