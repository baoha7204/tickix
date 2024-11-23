import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";
import { Jwt } from "@bhtickix/common";

let con: Connection;
let mongoServer: MongoMemoryServer;

declare global {
  var signin: () => string[];
}

global.signin = () => {
  // Build a JWT payload. { id, email }
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
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
