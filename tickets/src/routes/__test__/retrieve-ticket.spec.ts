import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

describe("Retrieve ticket route", () => {
  const retrieveTicketRoute = "/api/tickets";
  const title = "Title",
    price = 10.5;
  const createTicket = async () => {
    const cookie = global.signin();
    return request(app)
      .post(retrieveTicketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);
  };
  it("has a route handler for retrieve list requests", async () => {
    const res = await request(app).get(retrieveTicketRoute);
    expect(res.status).not.toEqual(404);
  });

  it("has a route handler for retrieve single request", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get(`${retrieveTicketRoute}/${id}`);
    expect(res.status).toEqual(404);
  });

  it("Successful - Response 200 when retrieving a list of tickets", async () => {
    await createTicket();
    await createTicket();

    const res = await request(app).get(retrieveTicketRoute);
    expect(res.body.length).toEqual(2);
  });

  it("Successful - Response 200 when retrieving a single ticket", async () => {
    const res = await createTicket();

    const retrieveRes = await request(app)
      .get(`${retrieveTicketRoute}/${res.body.id}`)
      .expect(200);
    expect(retrieveRes.body.title).toEqual(title);
    expect(retrieveRes.body.price).toEqual(price);
  });
});
