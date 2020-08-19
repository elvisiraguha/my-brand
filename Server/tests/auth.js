import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
jest.useFakeTimers();

describe("Signin routes", () => {
  it("should fail to signin with incomplete data", async (done) => {
    const res = await request.post("/api/auth/signin");

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to signin with inexisting email", async (done) => {
    const res = await request.post("/api/auth/signin").send({
      email: "iraguha@gil.com",
      password: "password",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User with given email is not found");
    done();
  });

  it("should fail to signin with incorret password", async (done) => {
    const res = await request.post("/api/auth/signin").send({
      email: "iraguha@gmail.com",
      password: "password",
    });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Password don't match");
    done();
  });

  it("should accept signin and return token", async (done) => {
    const res = await request.post("/api/auth/signin").send({
      email: "iraguha@gmail.com",
      password: "Password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Signin successfully");
    expect(res.body.data.token).toBeTruthy();
    done();
  });
});
