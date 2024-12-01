import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@bhtickix/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) throw new NotFoundError("Ticket not found");

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
