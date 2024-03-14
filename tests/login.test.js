import "dotenv/config";
import supertest from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../app.js";
import { User } from "../db/models/User.js";

mongoose.set("strictQuery", false);

const { TEST_DB_URI } = process.env;
const { SECRET_KEY } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);

    await User.deleteMany();

    await supertest(app).post("/api/users/register").send({
      email: "nulla.ante@vestibul.co.uk",
      password: "qwerty",
    });
  });

  afterAll(async () => {
    mongoose.disconnect(TEST_DB_URI);
  });

  it("should login user and return status code 200", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "nulla.ante@vestibul.co.uk",
      password: "qwerty",
    });

    expect(response.statusCode).toBe(200);
  });

  it("should login user and return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "nulla.ante@vestibul.co.uk",
      password: "qwerty",
    });

    var error = null;
    jwt.verify(response.body.token, SECRET_KEY, (err, decoded) => {
      error = err;
    });

    expect(error).toBe(null);
  });

  it("should login user and return the user object with 2 fields email and subscription with data type String", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "nulla.ante@vestibul.co.uk",
      password: "qwerty",
    });

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });
});
