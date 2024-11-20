import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import request from "supertest";

import app from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const email = "baoha3604@gmail.com";
  const password = "1234";

  await request(app)
    .post("/api/users/sign-up")
    .send({ email, password })
    .expect(201);

  const res = await request(app)
    .post("/api/users/sign-in")
    .send({ email, password })
    .expect(200);

  return res.get("Set-Cookie")!;
};

let con: Connection;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "test-jwt-key";
  mongoServer = await MongoMemoryServer.create();

  const mongo = await mongoose.connect(mongoServer.getUri(), {});
  con = mongo.connection;
});

beforeEach(async () => {
  const collections = await con.db?.collections();

  if (collections) {
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});
