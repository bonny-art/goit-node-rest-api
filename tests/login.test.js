import supertest from "supertest";
import mongoose from "mongoose";

import app from "../app.js";

mongoose.set("strictQuery", false);

const { DB_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });

  afterAll(async () => {
    mongoose.disconnect(DB_URI);
  });

  it("should login user", async () => {
    const response = (await supertest(app).post("/api/users/login")).send({
      email: "nulla1.ante@vestibul.co.uk",
      password: "qwerty",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.user.email).toBe("nulla1.ante@vestibul.co.uk");
    expect(response.body.data.user.subscription).toBe();
  });
});
