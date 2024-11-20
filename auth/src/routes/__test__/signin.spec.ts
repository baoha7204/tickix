import request from "supertest";

import app from "../../app";

describe("Sign in route", () => {
  const signUpRoute = "/api/users/sign-up";
  const signInRoute = "/api/users/sign-in";
  const registeredEmail = "baoha3604@gmail.com";
  const password = "1234";

  beforeEach(async () =>
    request(app)
      .post(signUpRoute)
      .send({ email: registeredEmail, password })
      .expect(201)
  );
  it("Successful - Response 200 with body", async () => {
    const res = await request(app)
      .post(signInRoute)
      .send({
        email: registeredEmail,
        password,
      })
      .expect(200);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(registeredEmail);
    expect(res.get("Set-Cookie")).toBeDefined();
  });

  it.each([
    {},
    { email: "", password: "" },
    { email: "baoha123gmail.com", password: "123" },
  ])(
    "Failed - Response 422 when email or password wrong",
    async ({ email, password }) => {
      const res = await request(app)
        .post(signInRoute)
        .send({
          email,
          password,
        })
        .expect(422);
      const { errors } = res.body;
      expect(errors.length).toBeGreaterThan(0);
    }
  );

  it("Failed - Response 400 if email doesn't exist", async () => {
    const res = await request(app)
      .post(signInRoute)
      .send({ email: "baoha36@gmail.com", password })
      .expect(400);
    const { errors } = res.body;
    expect(errors.length).toBeGreaterThan(0);
  });

  it("Failed - Response 400 if password not matching", async () => {
    const res = await request(app)
      .post(signInRoute)
      .send({ email: registeredEmail, password: "123" })
      .expect(400);
    const { errors } = res.body;
    expect(errors.length).toBeGreaterThan(0);
  });
});
