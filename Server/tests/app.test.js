import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);

describe("Articles routes", () => {
  it("should create a new article", async (done) => {
    const res = await request.post("/api/articles").send({
      title: "Post Five",
      content: "Lorem ipsum Lorem ipsum Lorem ipsum",
      publishedOn: new Date().toLocaleString(),
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Article created successfully");
    done();
  });

  it("should fetch a list of all articles", async (done) => {
    const res = await request.get("/api/articles");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Articles fetched successfully");
    done();
  });

  it("should fetch an individual article", async (done) => {
    const res = await request.get("/api/articles/5f322a26e079717269f2710a");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Article fetched successfully");
    done();
  });

  it("should fail to fetch an individual article with invalid id", async (done) => {
    const res = await request.get("/api/articles/f322a26e079717269f2710a");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Article Not Found");
    done();
  });

  it("should fail to fetch an individual article with incomplete id", async (done) => {
    const res = await request.get("/api/articles/f322a26e0710a");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Article Not Found");
    done();
  });

  it("should fail to access undefined routes", async (done) => {
    const res = await request.get("/f322a26e079717269f2710a");

    expect(res.status).toBe(405);
    expect(res.body.message).toBe("Method Not Allowed");
    done();
  });
});
