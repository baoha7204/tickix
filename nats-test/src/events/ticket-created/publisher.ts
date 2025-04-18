import { Publisher } from "../base/publisher";
import { TicketCreatedEvent } from "./event";
import { Subjects } from "../subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
