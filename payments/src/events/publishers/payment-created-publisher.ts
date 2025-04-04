import { PaymentCreatedEvent, Publisher, Subjects } from "@bhtickix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
