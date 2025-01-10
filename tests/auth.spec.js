require("dotenv").config();
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { app } = require("../app");
const { sequelize } = require("../config/db");
describe("POST /auth/register", () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should register a user successfully", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Fohn",
      lastName: "Goe",
      email: "gjohn.doe@example.com",
      password: "NPassword123",
      phone: "2234567890",
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data.user.firstName).toBe("Fohn");
  });
  it("should return an error when required fields are missing ", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "newfield34@gmail.com",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });
  it("should return an error for duplicate email", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "gjohn.doe@example.com",
      password: "NSecurePassword123",
      phone: "09876543210",
    });
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already exists");
  });
  it("should fail to log a user with invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "gjohn.doe@example.com",
      password: "NPassword1234",
    });
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("login unsuccessful. Password incorrect");
  });
  it("should log the user in successfully with valid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "jane.smith@example.com",
      password: "password@456",
    });
    // console.log("Body", res.body.data);
    let token = res.body.data.accessToken;
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.user).toHaveProperty("email", "jane.smith@example.com");
    // expect(res.body.data).toHaveProperty(token);
  });
});
