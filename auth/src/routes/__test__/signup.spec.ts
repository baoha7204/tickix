import request from "supertest";

import app from "../../app";

describe("Sign up route", () => {
  const route = "/api/users/sign-up";
  it("Successful - Response 201 with body", async () => {
    const registeredEmail = "baoha3604@gmail.com";
    const res = await request(app)
      .post(route)
      .send({
        email: registeredEmail,
        password: "1234",
      })
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(registeredEmail);
  });

  it.each([
    {},
    { email: "", password: "" },
    { email: "baoha123gmail.com", password: "123" },
    { email: "baoha123gmail.com", password: "1234" },
    { email: "baoha123@gmail.com", password: "123" },
  ])(
    "Failed - Response 422 when email or password wrong",
    async ({ email, password }) => {
      const res = await request(app)
        .post(route)
        .send({
          email,
          password,
        })
        .expect(422);
      const { errors } = res.body;
      expect(errors.length).toBeGreaterThan(0);
    }
  );

  it("Failed - Response 400 if email already exists", async () => {
    const email = "baoha3604@gmail.com";
    await request(app)
      .post(route)
      .send({ email, password: "1234" })
      .expect(201);

    const res = await request(app)
      .post(route)
      .send({ email, password: "1234" })
      .expect(400);
    const { errors } = res.body;
    expect(errors.length).toBeGreaterThan(0);
  });
});
