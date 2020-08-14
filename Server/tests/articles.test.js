import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
jest.useFakeTimers();
let id;

describe("Articles routes", () => {
  it("should fail to create a new article, with missing or short properties ", async (done) => {
    const res = await request.post("/api/articles").send({
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      imageUrl: "https://picsum.photos/200/300",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should create a new article", async (done) => {
    const res = await request.post("/api/articles").send({
      title: "a new article in test",
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      imageUrl: "https://picsum.photos/200/300",
    });
    id = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Article created successfully");
    done();
  });

  it("should fail to create an article if title alread exist", async (done) => {
    const res = await request.post("/api/articles").send({
      title: "a new article in test",
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      imageUrl: "https://picsum.photos/200/300",
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toContain("alread exists");
    done();
  });

  it("should fetch a list of all articles", async (done) => {
    const res = await request.get("/api/articles");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Articles fetched successfully");
    done();
  });

  it("should fetch an individual article", async (done) => {
    const res = await request.get(`/api/articles/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article fetched successfully");
    done();
  });

  it("should fail to fetch an article with unexisting id", async (done) => {
    const res = await request.get("/api/articles/4f322a26e079717269f2710a");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The article with given id does not exist");
    done();
  });

  it("should fail to access undefined routes", async (done) => {
    const res = await request.get("/f322a26e079717269f2710a");

    expect(res.status).toBe(405);
    expect(res.body.message).toBe("Method Not Allowed");
    done();
  });

  it("should update an article", async (done) => {
    const res = await request.patch(`/api/articles/${id}`).send({
      title: "Post Updated",
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      imageUrl: "https://picsum.photos/200/300",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article updated successfully");
    done();
  });

  it("should fail to update an article with unexisting id", async (done) => {
    const res = await request
      .patch(`/api/articles/5f3530278d5769275f0ea769`)
      .send({
        title: "Post Updated",
        content: "Lorem ipsum Lorem ipsum Lorem ipsum",
        imageUrl: "https://picsum.photos/200/300",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The article with given id does not exist");
    done();
  });

  it("should fail to update an article when no new contents provided", async (done) => {
    const res = await request.patch(`/api/articles/${id}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You must provide the updated contents");
    done();
  });

  it("should fail to update an article with invalid id", async (done) => {
    const res = await request.patch(`/api/articles/f322a26e07970a`).send({
      title: "Post Updated",
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      imageUrl: "https://picsum.photos/200/300",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The provided article id is incorrect.");
    done();
  });

  it("should delete an article", async (done) => {
    const res = await request.delete(`/api/articles/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article deleted successfully");
    done();
  });
});
