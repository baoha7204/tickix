import request from "supertest";

import app from "../../app";

describe("Retrieve ticket route", () => {
  it("has a route handler listening to /api/tickets for retrieve requests", async () => {
    const res = await request(app).get("/api/tickets");
    expect(res.status).not.toEqual(404);
  });
});
