import { OrderCancelledEvent, Publisher, Subjects } from "@bhtickix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
