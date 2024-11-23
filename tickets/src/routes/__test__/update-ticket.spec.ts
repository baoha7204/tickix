import request from "supertest";

import app from "../../app";

describe("Update ticket route", () => {
  it("has a route handler for update requests", async () => {
    const res = await request(app).put("/api/tickets");
    expect(res.status).not.toEqual(404);
  });
});
