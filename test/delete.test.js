//jshint esversion:8
const request = require("supertest");
const { app } = require("../server");


const iD = "staffs@test.com";
let adminToken, basicToken;
beforeEach((done) => {
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

describe("DELETE /user", () => {
   it("POST new user after login as SuperUser!", async () => {
     const { body, statusCode } = await request(app)
       .post("/api/v1/user")
       .set("Authorization", adminToken)
       .send({
         full_name: "test test",
         email: iD,
         phone: "+2556000000001",
         password: "123456",
       });
     expect(body).toEqual(
       expect.objectContaining({
         message: "user successfully created!",
       })
     );
     expect(statusCode).toBe(201);
   });
   
  it("DELETE user without login", async () => {
    const { body, statusCode } = await request(app)
      .delete(`/api/v1/user/${iD}`)
      .set("Authorization", "");
    expect(body).toEqual(
      expect.objectContaining({
        message: "You are not logged in! Please log in to get access!",
      })
    );
    expect(statusCode).toBe(401);
  });

  it("DELETE user after login as normalUser!", async () => {
    const { body, statusCode } = await request(app)
      .delete(`/api/v1/user/${iD}`)
      .set("Authorization", basicToken);
    expect(body).toEqual({
      message: "You do not have permission to perform this action!",
    });
    expect(statusCode).toBe(403);
  });

  it("DELETE user after login as SuperUser!", async () => {
    const { body, statusCode } = await request(app)
      .delete(`/api/v1/user/${iD}`)
      .set("Authorization", adminToken);
    expect(body).toEqual({
      message: "User Successfully deleted!",
    });
    expect(statusCode).toBe(404);
  });

  it("DELETE user after Logout", async () => {
    const { body, statusCode } = await request(app)
      .delete(`/api/v1/user/${iD}`)
      .set("Authorization", "logout");
    expect(body).toEqual(
      expect.objectContaining({
        message: "session has been expired! Please log in to get access!",
      })
    );
    expect(statusCode).toBe(401);
  });
});
