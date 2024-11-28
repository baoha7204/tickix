import { Publisher, Subjects, TicketUpdatedEvent } from "@bhtickix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
