import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
jest.useFakeTimers();
let token;

describe("Queries routes", () => {
  it("should signin a user", async (done) => {
    const res = await request.post("/api/auth/signin").send({
      email: "iraguha@gmail.com",
      password: "Password123",
    });

    token = res.body.data.token;

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Signin successfully");
    expect(res.body.data.token).toBeTruthy();
    done();
  });

  it("should fail to view queries, when no token is provided", async (done) => {
    const res = await request.get("/api/queries")

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No auth-token provided");
    done();
  });

   it("should fail to view queries, with malformed token", async (done) => {
    const res = await request
      .get("/api/queries")
      .set(
        "x-auth-token",
        "fyJhbGciOiJIUzI1NiJ9.aXJhZ3VoYUBnbWFpbC5jb20.plXdy03Drj466Xuy5dnOmMlPDzL5Iu7w7klK_-UixXA"
      );
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to view queries, when user with current token is not found", async (done) => {
    const res = await request
      .get("/api/queries")
      .set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiJ9.aXJhZ3VoYUBnbW0.KMTUdOu1E-CF-JxB03zzocy4aDkcqHFjhd0ReePFFCw"
      );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User with given email is not found');
    done();
  });

  it("should fetch queries", async (done) => {
    const res = await request
      .get("/api/queries")
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Queries fetched successfully");
    done();
  });

  it("should fail to post a query, whith incomplete or short properties", async (done) => {
    const res = await request
      .post("/api/queries")
      .send({
        name: 'Someone New'
      })

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });


  it("should post a query", async (done) => {
    const res = await request
      .post("/api/queries")
      .send({
        name: 'Someone New',
        email: 'someone@new.email',
        subject: 'Asking for more tutorials',
        message: 'Hello Elvis, I would like to ask you to post more tutorial articles, your articles have been very helpful in the past'
      })

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Message sent successfully');
    done();
  });
});
