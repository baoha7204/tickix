import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order } from "../../model/order";
import { OrderStatus } from "@bhtickix/common";

describe("Create Charge Route", () => {
  const paymentsRoute = "/api/payments";

  it("Failed - return 401 when user is not signed in", async () => {
    await request(app).post(paymentsRoute).send({}).expect(401);
  });
  it.each([
    { errors: 3 },
    { token: "", orderId: "", errors: 3 },
    { token: "123", orderId: "", errors: 2 },
    { token: "123", orderId: "123", errors: 1 },
  ])(
    "Failed - return 422 with invalid inputs",
    async ({ token, orderId, errors }) => {
      const cookie = global.signin();
      const response = await request(app)
        .post(paymentsRoute)
        .send({ token, orderId })
        .set("Cookie", cookie)
        .expect(422);

      expect(response.body.errors.length).toEqual(errors);
    }
  );
  it("Failed - return 404 when purchasing an order that does not exist", async () => {
    const cookie = global.signin();
    await request(app)
      .post(paymentsRoute)
      .send({
        token: "123",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .set("Cookie", cookie)
      .expect(404);
  });

  it("Failed - return 401 when purchasing an order that does not belong to user", async () => {
    const order = Order.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      price: 20,
      version: 0,
    });

    await order.save();

    await request(app)
      .post(paymentsRoute)
      .set("Cookie", global.signin())
      .send({
        token: "123",
        orderId: order.id,
      })
      .expect(401);
  });

  it("Sucess - return 201 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      userId,
      status: OrderStatus.Created,
      price: 20,
      version: 0,
    });

    await order.save();

    await request(app)
      .post(paymentsRoute)
      .set("Cookie", global.signin(userId))
      .send({
        token: "123",
        orderId: order.id,
      })
      .expect(201);
  });
});
