import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";

describe("Update ticket route", () => {
  const updateTicketRoute = "/api/tickets";
  const newTitle = "new title",
    newPrice = 50.9;
  const title = "Title",
    price = 10.5;

  it("Failed - Response 401 if the user not signed in", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).put(`${updateTicketRoute}/${id}`).send({}).expect(401);
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
        .put(`${updateTicketRoute}/${id}`)
        .set("Cookie", cookie)
        .send({ title, price })
        .expect(422);
    }
  );

  it("Failed - Response 404 if the provided id does not exits", async () => {
    const cookie = global.signin();
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`${updateTicketRoute}/${id}`)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(404);
  });

  it("Failed - return 401 if the user does not own the ticket", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(updateTicketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    await request(app)
      .put(`${updateTicketRoute}/${res.body.id}`)
      .set("Cookie", global.signin())
      .send({ title: newTitle, price: newPrice })
      .expect(401);
  });

  it("Successful - Response 200 when updating a ticket", async () => {
    const cookie = global.signin();
    const res = await request(app)
      .post(updateTicketRoute)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .put(`${updateTicketRoute}/${res.body.id}`)
      .set("Cookie", cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(200);

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
  });
});
