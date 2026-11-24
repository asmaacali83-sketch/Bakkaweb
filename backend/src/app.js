const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const pool = require("./config/database");
const authRoutes = require("./routes/auth");
const { AppError } = require("./utils/errors");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new AppError("Origin is not allowed", 403, "CORS_ORIGIN_DENIED"));
    },
    credentials: true,
  }),
);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/api/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "bakka-training-center-api",
      database: "connected",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: status === 500 ? "An unexpected error occurred" : error.message,
    },
  });
});

module.exports = app;
