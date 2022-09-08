//jshint esversion:8
const request = require("supertest");
const { app } = require("../server");

let adminToken, basicToken;
beforeEach((done)=> {
     request(app)
       .post("/api/v1/login")
       .send({ email: "admin@test.com", password: "000111" })
       .end((err, res) => {
         adminToken = res.body.token;
       });
    request(app)
      .post("/api/v1/login")
      .send({ email: "basic@test.com", password: "000113" })
      .end((err, res) => {
        basicToken = res.body.token;
        done();
      });
});

describe("GET /user", () => {
  it("Get user without Login", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/v1/user")
      .set("Authorization", "");
    expect(body).toEqual(
      expect.objectContaining({
        message: "You are not logged in! Please log in to get access!",
      })
    );
    expect(statusCode).toBe(401);
  });

  it("Get user after Login as normalUser", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/v1/user")
      .set("Authorization", basicToken);
    expect(body).toEqual(
      expect.objectContaining({
        message: "You do not have permission to perform this action!",
      })
    );
    expect(statusCode).toBe(403);
  });

  it("Get user after Login as superUser", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/v1/user")
      .set("Authorization", adminToken);
    expect(body).toEqual(
      expect.objectContaining({
        message: "All user are fetched!",
      })
    );
    expect(statusCode).toBe(200);
  });

  it("Get user after Logout", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/v1/user")
      .set("Authorization", "logout");
    expect(body).toEqual(
      expect.objectContaining({
        message: "session has been expired! Please log in to get access!",
      })
    );
    expect(statusCode).toBe(401);
  });
});