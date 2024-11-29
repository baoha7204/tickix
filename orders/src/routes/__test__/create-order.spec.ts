import request from "supertest";

import app from "../../app";
import mongoose from "mongoose";

describe("Create Order Route", () => {
  const ordersRoute = "/api/orders";
  it("Failed - Response 401 if the user not signed in", async () => {
    await request(app).post(ordersRoute).send({}).expect(401);
  });

  it("Failed - Response 404 if the ticket does not exist", async () => {
    const cookie = global.signin();
    await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie)
      .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
      .expect(404);
  });

  it("Failed - Response 400 if the ticket is already reserved", async () => {
    const cookie = global.signin();
    const ticket = await global.createTicket();
    await global.createOrder(ticket);

    await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("Success - Response 201 if the order is created successfully", async () => {
    const cookie = global.signin();
    const ticket = await global.createTicket();

    const res = await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(res.body.userId).toBeDefined();
  });
});
