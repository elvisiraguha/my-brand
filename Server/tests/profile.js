import supertest from "supertest";
import app from "../index.js";

const request = supertest(app);
let skillId;
let projectId;
let experienceId;
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
    const res = await request.post("/api/profile/skills").send({
      title: "a new article in test",
      logoUrl: "https://picsum.photos/200/300",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No auth-token provided");
    done();
  });

  it("should fail to modify an item, with malformed token", async (done) => {
    const res = await request
      .post("/api/profile/skills")
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

  it("should fail to modify an item,, when user with current token is not found", async (done) => {
    const res = await request
      .post("/api/profile/skills")
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
      .post("/api/profile/skills")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", "something invalid");
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to create a skill, with short, invalid or no contents", async (done) => {
    const res = await request
      .post("/api/profile/skills")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to create a project, with short, invalid or no contents", async (done) => {
    const res = await request
      .post("/api/profile/projects")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to create an experience, with short, invalid or no contents", async (done) => {
    const res = await request
      .post("/api/profile/experiences")
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should create new skill", async (done) => {
    const res = await request
      .post("/api/profile/skills")
      .send({
        title: "a new article in test",
        logoUrl: "https://picsum.photos/200/300",
      })
      .set("x-auth-token", token);
    skillId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Skill created successfully");
    done();
  });

  it("should create new project", async (done) => {
    const res = await request
      .post("/api/profile/projects")
      .send({
        title: "Auth",
        logoUrl: "https://picsum.photos/200/300",
        description: "A Signup and Signin form built using React js",
        link: "https://my-auth-ui.herokuapp.com/",
      })
      .set("x-auth-token", token);

    projectId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Project created successfully");
    done();
  });

  it("should create new experience", async (done) => {
    const res = await request
      .post("/api/profile/experiences")
      .send({
        title: "Freelancing",
        description:
          "I have worked on several tech solutions as a freelancer which includes both front-end and back-end stack.",
        startDate: "2020-03-26",
        endDate: "Present",
      })
      .set("x-auth-token", token);

    experienceId = res.body.data._id;
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Experience created successfully");
    done();
  });

  it("should fail to update items, when no contents provided", async (done) => {
    const res = await request
      .patch(`/api/profile/experiences/${experienceId}`)
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You must provide the updated contents");
    done();
  });

  it("should fail to update skill, when provided short or invalid contents", async (done) => {
    const res = await request
      .patch(`/api/profile/skills/${skillId}`)
      .send({
        title: "f",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to update project, when provided short or invalid contents", async (done) => {
    const res = await request
      .patch(`/api/profile/projects/${projectId}`)
      .send({
        title: "f",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeTruthy();
    done();
  });

  it("should fail to update experience, when provided short or invalid contents", async (done) => {
    const res = await request
      .patch(`/api/profile/experiences/${experienceId}`)
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
      .patch("/api/profile/skills/fdsafafa")
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("The provided item id is incorrect");
    done();
  });

  it("should fail to modify an item, when provided inexisting id", async (done) => {
    const res = await request
      .patch("/api/profile/skills/5f3530278d5769275f0ea769")
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("The item with given id does not exist");
    done();
  });

  it("should update a skill", async (done) => {
    const res = await request
      .patch(`/api/profile/skills/${skillId}`)
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Skill updated successfully");
    done();
  });

  it("should update a project", async (done) => {
    const res = await request
      .patch(`/api/profile/projects/${projectId}`)
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Project updated successfully");
    done();
  });

  it("should update an experience", async (done) => {
    const res = await request
      .patch(`/api/profile/experiences/${experienceId}`)
      .send({
        title: "Updated title",
      })
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Experience updated successfully");
    done();
  });

  it("should delete a profile item", async (done) => {
    const res = await request
      .delete(`/api/profile/experiences/${experienceId}`)
      .set("x-auth-token", token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");
    done();
  });
});
