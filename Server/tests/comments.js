import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
let token;
let id;

describe("Comments routes", () => {
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

  it("should create a new article", async (done) => {
    const res = await request
      .post("/api/articles")
      .send({
        title: "another article in test",
        content: "Lorem ipsum Lorem ipsum Lorem ipsum",
        imageUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", token);

    id = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Article created successfully");
    done();
  });

  it("should fail create a new comment, when article id is invalid", async (done) => {
    const res = await request.post(`/api/articles/fdaskdfaskj/comment`).send({
      name: "Anonymous",
      email: "user@mail.email",
      comment: "a newly created comment",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The provided article id is incorrect.");
    done();
  });

  it("should fail create a new comment, when article id is not found", async (done) => {
    const res = await request
      .post(`/api/articles/5f3530278d5769275f0ea769/comment`)
      .send({
        name: "Anonymous",
        email: "user@mail.email",
        comment: "a newly created comment",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The article with given id does not exist");
    done();
  });

  it("should fail to create a new comment, with incomplete contents", async (done) => {
    const res = await request.post(`/api/articles/${id}/comment`).send({
      comment: "a newly created comment",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should create a new comment", async (done) => {
    const res = await request.post(`/api/articles/${id}/comment`).send({
      name: "Anonymous",
      email: "user@mail.email",
      comment: "a newly created comment",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Comment added successfully");
    done();
  });

  it("should fetch an individual article with created comments", async (done) => {
    const res = await request.get(`/api/articles/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article fetched successfully");
    expect(res.body.data.comments).toBeTruthy();
    done();
  });

  it("should delete an article", async (done) => {
    const res = await request
      .delete(`/api/articles/${id}`)
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article deleted successfully");
    done();
  });
});
