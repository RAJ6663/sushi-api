const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server");

describe("Sushi API basic tests", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("GET /sushi should return 200", async () => {
    const res = await request(app).get("/sushi");
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});