import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection } from "mongoose";

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
