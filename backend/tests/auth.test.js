const request = require("supertest");
const app = require("../src/app");

describe("protected authentication endpoints", () => {
  it("rejects requests without a session cookie", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
  });

  describe("POST /api/auth/register", () => {
    it("requires a valid name, email, and 12-character password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ fullName: "Asmaa", email: "asmaa@example.com", password: "short" });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("does not allow public registration to choose a privileged role", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Test Student",
          email: "test@example.com",
          password: "long-enough-password",
          role: "admin",
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
