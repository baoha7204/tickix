import mongoose from "mongoose";
import { Ticket } from "../ticket";

describe("Ticket Model", () => {
  it("Success - should implement optimistic concurrency control", async () => {
    const ticket = Ticket.build({
      title: "concert-test",
      price: 11.5,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    // Save the ticket to the database
    await ticket.save();
    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 20 });

    // Save the first fetched ticket
    await firstInstance!.save();

    // Save the second fetched ticket and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("Success - should increment the version number on multiple saves", async () => {
    const ticket = Ticket.build({
      title: "concert-test",
      price: 11.5,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });

    // Save the ticket to the database
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
