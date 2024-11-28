import { Publisher, Subjects, TicketCreatedEvent } from "@bhtickix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
