const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const express = require("express");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const pool = require("../config/database");
const { authenticate } = require("../middleware/auth");
const { AppError } = require("../utils/errors");

const router = express.Router();

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(req, res) {
    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many registration attempts. Please try again later.",
      },
    });
  },
});

const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(12).max(128),
}).strict();

function setSessionCookie(res, user) {
  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "8h" },
  );
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

router.post("/register", registerLimiter, async (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      "Enter a valid name and email, and a password with at least 12 characters",
      400,
      "VALIDATION_ERROR",
    );
  }

  const { fullName, email, password } = parsed.data;
  const connection = await pool.getConnection();
  let userId;
  const studentNumber = `BKC-STU-${new Date().getFullYear()}-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

  try {
    await connection.beginTransaction();
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (existingUsers.length) {
      throw new AppError("An account with this email already exists", 409, "EMAIL_ALREADY_REGISTERED");
    }

    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE name = 'student' LIMIT 1",
    );
    if (!roles.length) {
      throw new AppError("Student registration is currently unavailable", 503, "STUDENT_ROLE_UNAVAILABLE");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [userResult] = await connection.execute(
      "INSERT INTO users (role_id, email, password_hash, full_name, status) VALUES (?, ?, ?, ?, 'active')",
      [roles[0].id, email, passwordHash, fullName],
    );
    userId = userResult.insertId;

    await connection.execute(
      "INSERT INTO students (user_id, student_number, full_name, email, status) VALUES (?, ?, ?, ?, 'active')",
      [userId, studentNumber, fullName, email],
    );
    await connection.execute(
      "INSERT INTO audit_logs (action, target_type, target_id, metadata) VALUES (?, ?, ?, ?)",
      ["student_account.registered", "user", String(userId), JSON.stringify({ source: "public-registration" })],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError("An account with this email already exists", 409, "EMAIL_ALREADY_REGISTERED");
    }
    throw error;
  } finally {
    connection.release();
  }

  const user = { id: userId, email, role: "student" };
  setSessionCookie(res, user);
  res.status(201).json({ success: true, data: { ...user, studentNumber } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password are required", 400, "VALIDATION_ERROR");
  }

  const [rows] = await pool.execute(
    "SELECT u.id, u.email, u.password_hash, u.status, r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=? LIMIT 1",
    [String(email).trim().toLowerCase()],
  );
  if (!rows.length || rows[0].status !== "active") {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
  const valid = await bcrypt.compare(String(password), rows[0].password_hash);
  if (!valid) throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");

  setSessionCookie(res, rows[0]);
  res.json({ success: true, data: { id: rows[0].id, email: rows[0].email, role: rows[0].role } });
});

router.post("/logout", authenticate, (req, res) => {
  res.clearCookie("session");
  res.json({ success: true, data: { loggedOut: true } });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
