const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
  it("returns the API status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        status: "ok",
        service: "bakka-training-center-api",
        database: "connected",
      },
    });
  });
});
