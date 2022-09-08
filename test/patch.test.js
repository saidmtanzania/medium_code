//jshint esversion:8
const request = require("supertest");
const { app } = require("../server");

let adminToken;

beforeEach((done) => {
  request(app)
    .post("/api/v1/login")
    .send({ email: "admin@test.com", password: "000111" })
    .end((err, res) => {
      adminToken = res.body.token;
      done();
    });
});


describe("PATCH /user", () => {

  it("Change Password after Login", async () => {
    const { body, statusCode } = await request(app)
      .patch("/api/v1/user")
      .set("Authorization", adminToken)
      .send({ password: "000111" });
    expect(body).toEqual(
      expect.objectContaining({
        message: "user Password changing successfully",
      })
    );
    expect(statusCode).toBe(200);
  });
});
