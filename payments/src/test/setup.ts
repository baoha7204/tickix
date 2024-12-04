import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { Jwt } from "@bhtickix/common";

let con: Connection;
let mongoServer: MongoMemoryServer;

jest.mock("../nats-wrapper");

declare global {
  var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "baoha3604@gmail.com",
  };

  // Create the JWT
  const token = Jwt.sign(payload);

  // Build session Object and turn that session into JSON
  const session = JSON.stringify({ jwt: token });

  // Take JSON and encode it as base64
  const base64 = Buffer.from(session).toString("base64");

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};

beforeAll(async () => {
  process.env.JWT_KEY = "test-jwt-key";
  mongoServer = await MongoMemoryServer.create();

  const mongo = await mongoose.connect(mongoServer.getUri(), {});
  con = mongo.connection;
});

beforeEach(async () => {
  jest.clearAllMocks();
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
