import { ExpirationCompleteEvent, Publisher, Subjects } from "@bhtickix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
