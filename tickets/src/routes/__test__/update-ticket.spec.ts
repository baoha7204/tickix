import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

describe("Update ticket route", () => {
  const ticketRoute = "/api/tickets";
  const newTitle = "new title",
    newPrice = 50.9;
  const title = "Title",
    price = 10.5;

  it("Failed - Response 401 if the user not signed in", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`${ticketRoute}/${id}`).send({}).expect(401);
  });

  it.each([
    { price: 10 },
    { title: "", price: 10 },
    { title: "Title", price: -10 },
    { title: "Title" },
  ])(
    "Failed - Response 422 if an invalid Title or Price is provided",
    async ({ title, price }) => {
      const cookie = global.signin();
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app)
        .put(`${ticketRoute}/${id}`)
        .set("Cookie", cookie)
        .send({ title, price })
        .expect(422);
    }
  );

  it("Failed - Response 404 if the provided id does not exits", async () => {
    const cookie = global.signin();
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`${ticketRoute}/${id}`)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(404);
  });

  it("Failed - return 401 if the user does not own the ticket", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    await request(app)
      .put(`${ticketRoute}/${res.body.id}`)
      .set("Cookie", global.signin())
      .send({ title: newTitle, price: newPrice })
      .expect(401);
  });

  it("Failed - return 401 if the ticket is reserved", async () => {
    const cookie = global.signin();
    const { body: res } = await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    const ticket = await Ticket.findById(res.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

    await ticket!.save();

    await request(app)
      .put(`${ticketRoute}/${ticket!.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(401);
  });

  it("Successful - Response 200 when updating a ticket", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .put(`${ticketRoute}/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
  });

  it("Successful - Publishes an event", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    await request(app)
      .put(`${ticketRoute}/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
