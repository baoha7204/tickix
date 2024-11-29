import request from "supertest";

import app from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "@bhtickix/common";

describe("Cancel Order Route", () => {
  const ordersRoute = "/api/orders";
  it("Failed - Response 401 if the user not signed in", async () => {
    await request(app)
      .delete(`${ordersRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
      .expect(401);
  });

  it("Failed - Response 404 if the order not found", async () => {
    await request(app)
      .delete(`${ordersRoute}/${new mongoose.Types.ObjectId().toHexString()}`)
      .set("Cookie", global.signin())
      .expect(404);
  });

  it("Failed - Response 401 if the user is not the owner of the order", async () => {
    const ticket = await global.createTicket();

    const { body: order } = await request(app)
      .post(ordersRoute)
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete(`${ordersRoute}/${order.id}`)
      .set("Cookie", global.signin())
      .expect(401);
  });

  it("Success - Response 204 if the order is cancelled successfully", async () => {
    const cookie = global.signin();
    const ticket = await global.createTicket();

    const { body: order } = await request(app)
      .post(ordersRoute)
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete(`${ordersRoute}/${order.id}`)
      .set("Cookie", cookie)
      .expect(204);

    const { body: cancelledOrder } = await request(app)
      .get(`${ordersRoute}/${order.id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
  });
});
