import request from "supertest";

import app from "../../app";
import mongoose from "mongoose";

describe("Retrieve Order Route", () => {
  const ordersRoute = "/api/orders";
  it("Failed - Response 401 if the user not signed in when fetching list of orders", async () => {
    await request(app).get(ordersRoute).expect(401);
  });

  it("Failed - Response 401 if the user not signed in when fetching single order", async () => {
    await request(app).get(`${ordersRoute}/1`).expect(401);
  });

  it("Success - Response 200 with fetched list of orders", async () => {
    // Create 2 users
    const cookie_1 = global.signin();
    const cookie_2 = global.signin();

    // Create 3 tickets
    const ticket_1 = await global.createTicket();
    const ticket_2 = await global.createTicket();
    const ticket_3 = await global.createTicket();

    // Create 1 order as User #1
    await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie_1)
      .send({ ticketId: ticket_1.id })
      .expect(201);

    // Create 2 orders as User #2
    const { body: order_1 } = await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie_2)
      .send({ ticketId: ticket_2.id })
      .expect(201);

    const { body: order_2 } = await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie_2)
      .send({ ticketId: ticket_3.id })
      .expect(201);

    // Fetch orders for User #2
    const res = await request(app)
      .get(ordersRoute)
      .set("Cookie", cookie_2)
      .expect(200);

    expect(res.body.length).toEqual(2);
    expect(res.body[0].id).toEqual(order_1.id);
    expect(res.body[1].id).toEqual(order_2.id);
    expect(res.body[0].ticket.id).toEqual(ticket_2.id);
    expect(res.body[1].ticket.id).toEqual(ticket_3.id);
  });

  it("Failed - Response 404 if the order not found", async () => {
    const cookie = global.signin();

    await request(app)
      .get(`${ordersRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
      .set("Cookie", cookie)
      .expect(404);
  });

  it("Failed - Response 401 if the order does not belong to the user", async () => {
    // Create a ticket
    const ticket = await global.createTicket();
    // Create an order
    const { body: order } = await request(app)
      .post(ordersRoute)
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`${ordersRoute}/${order.id}`)
      .set("Cookie", global.signin())
      .expect(401);
  });

  it("Success - Response 200 with fetched single order", async () => {
    // Create a user
    const cookie = global.signin();

    // Create a ticket
    const ticket = await global.createTicket();

    // Create an order
    const { body: order } = await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    // Fetch the order
    const { body: fetchedOrder } = await request(app)
      .get(`${ordersRoute}/${order.id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
    expect(fetchedOrder.ticket.id).toEqual(ticket.id);
  });
});
