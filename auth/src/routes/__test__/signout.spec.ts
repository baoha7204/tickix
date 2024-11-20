import request from "supertest";

import app from "../../app";

describe("Sign in route", () => {
  const signUpRoute = "/api/users/sign-up";
  const signInRoute = "/api/users/sign-in";
  const signOutRoute = "/api/users/sign-out";
  const email = "baoha3604@gmail.com";
  const password = "1234";

  beforeEach(async () => {
    await request(app).post(signUpRoute).send({ email, password }).expect(201);

    await request(app).post(signInRoute).send({ email, password }).expect(200);
  });
  it("Successful - Response 200 with body", async () => {
    const res = await request(app).post(signOutRoute).expect(200);
    const session = res.get("Set-Cookie")?.[0];
    expect(session).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
