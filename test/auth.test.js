//jshint esversion:8
const request = require("supertest");
const { app } = require("../server");

describe("POST /login", () => {
  it("Login with empty credential", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/v1/login")
      .send();
    expect(body).toEqual({
      message: "user email or password is invalid!",
    });
    expect(statusCode).toBe(400);
  });

  it("Login with wrong credential", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@test.com", password: "000112" });
    expect(body).toEqual({
      message: "email or password is invalid! ",
    });
    expect(statusCode).toBe(401);
  });

  it("Login with right credential", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@test.com", password: "000111" });
    expect(body).toEqual(
      expect.objectContaining({
        message: "user successfully logged in",
      })
    );
    expect(statusCode).toBe(200);
  });
});
