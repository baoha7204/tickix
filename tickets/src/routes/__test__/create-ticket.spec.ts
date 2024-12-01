import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("Create ticket route", () => {
  const ticketRoute = "/api/tickets";
  it("has a route handler for post requests", async () => {
    const res = await request(app).post(ticketRoute).send({});
    expect(res.status).not.toEqual(404);
  });

  it("Failed - Response 401 if the user not signed in", async () => {
    await request(app).post(ticketRoute).send({}).expect(401);
  });

  it("Successful - Response not 401 if the user signed in", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({});
    expect(res.status).not.toEqual(401);
  });

  it.each([
    { price: 10 },
    { title: "", price: 10 },
    { title: "Title", price: -10 },
    { title: "Title" },
  ])(
    "Failed - Response 422 if an invalid Title or Price is provided",
    async (body) => {
      const cookie = global.signin();
      await request(app)
        .post(ticketRoute)
        .set("Cookie", cookie)
        .send(body)
        .expect(422);
    }
  );

  it("Successful - Response 201 when creating a ticket with valid inputs", async () => {
    const title = "Title",
      price = 10.5;
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const cookie = global.signin();
    await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);
  });

  it("Successful - Publishes an event", async () => {
    const title = "Title",
      price = 10.5;
    const cookie = global.signin();
    await request(app)
      .post(ticketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
