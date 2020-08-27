import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
let itemId;
let token;

describe("Profile routes", () => {
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

  it("should fetch a list of all profile items", async (done) => {
    const res = await request.get("/api/profile");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Profile items fetched successfully");
    expect(res.body.data).toBeTruthy();
    done();
  });

  it("should fetch a list of all profile info", async (done) => {
    const res = await request.get("/api/profile/info");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Profile info fetched successfully");
    expect(res.body.data).toBeTruthy();
    done();
  });

  it("should fail to update profile info, when no token provided", async (done) => {
    const res = await request.patch("/api/profile/info").send({
      address: "Muhanga, Rwanda",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No auth-token provided");
    done();
  });

  it("should fail to update profile info, when provided invalid or short contents", async (done) => {
    const res = await request
      .patch("/api/profile/info")
      .send({
        address: "M",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should update profile info", async (done) => {
    const res = await request
      .patch("/api/profile/info")
      .send({
        address: "Muhanga, Rwanda",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Info updated successfully");
    expect(res.body.data).toBeTruthy();
    done();
  });

  it("should fail to modify an item, when no token is provided", async (done) => {
    const res = await request.post("/api/profile").send({
      title: "a new article in test",
      logoUrl: "https://picsum.photos/200/300",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No auth-token provided");
    done();
  });

  it("should fail to modify an item, with malformed token", async (done) => {
    const res = await request
      .post("/api/profile")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set(
        "x-auth-token",
        "fyJhbGciOiJIUzI1NiJ9.aXJhZ3VoYUBnbWFpbC5jb20.plXdy03Drj466Xuy5dnOmMlPDzL5Iu7w7klK_-UixXA"
      );
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to modify an item, when user with current token is not found", async (done) => {
    const res = await request
      .post("/api/profile")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiJ9.aXJhZ3VoYUBnbW0.KMTUdOu1E-CF-JxB03zzocy4aDkcqHFjhd0ReePFFCw"
      );
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User with given email is not found");
    done();
  });

  it("should fail to modify an item, with invalid token", async (done) => {
    const res = await request
      .post("/api/profile")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", "something invalid");
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to create an item, with short, invalid or no contents", async (done) => {
    const res = await request
      .post("/api/profile")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to create a new item, provided no or invalid query", async (done) => {
    const res = await request
      .post("/api/profile?itemType=somethingInvalid")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should create a new item", async (done) => {
    const res = await request
      .post("/api/profile?itemType=skill")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", token);

    itemId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Item created successfully");
    done();
  });

  it("should fail to update an item, when no contents provided", async (done) => {
    const res = await request
      .patch(`/api/profile/${itemId}`)
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You must provide the contents");
    done();
  });

  it("should fail to update an item, when provided short or invalid contents", async (done) => {
    const res = await request
      .patch(`/api/profile/${itemId}`)
      .send({
        title: "f",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to modify an item, when provided invalid id", async (done) => {
    const res = await request
      .patch("/api/profile/fdsafafa")
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("The provided id is incorrect");
    done();
  });

  it("should fail to modify an item, when provided inexisting id", async (done) => {
    const res = await request
      .patch("/api/profile/5f3530278d5769275f0ea769")
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The item with given id does not exist");
    done();
  });

  it("should update an item", async (done) => {
    const res = await request
      .patch(`/api/profile/${itemId}`)
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item updated successfully");
    done();
  });

  it("should delete an item", async (done) => {
    const res = await request
      .delete(`/api/profile/${itemId}`)
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");
    done();
  });
});
