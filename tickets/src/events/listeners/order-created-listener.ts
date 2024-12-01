import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from "@bhtickix/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "../../constants";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError("Ticket not found");

    ticket.set({ orderId });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
