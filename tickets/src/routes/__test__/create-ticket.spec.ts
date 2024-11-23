import request from "supertest";

import app from "../../app";

describe("Create ticket route", () => {
  it("has a route handler listening to /api/tickets for post requests", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toEqual(404);
  });
});
