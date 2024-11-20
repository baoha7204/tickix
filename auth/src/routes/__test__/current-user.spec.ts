import request from "supertest";

import app from "../../app";

describe("Current user route", () => {
  it("Successful (Authenticated) - Response 200 with body", async () => {
    const cookie = await global.signin();

    const res = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", cookie)
      .expect(200);

    const { currentUser } = res.body;
    expect(currentUser).toBeDefined();
    expect(currentUser.email).toBeDefined();
  });

  it("Successful (Not Authenticated) - Response 200 with body", async () => {
    const res = await request(app).get("/api/users/current-user").expect(200);

    const { currentUser } = res.body;
    expect(currentUser).toBeNull();
  });
});
