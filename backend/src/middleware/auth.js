const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errors");

function authenticate(req, res, next) {
  const token = req.cookies?.session;
  if (!token) throw new AppError("Authentication required", 401, "UNAUTHORIZED");

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch {
    throw new AppError("Your session is invalid or expired", 401, "INVALID_SESSION");
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("You do not have permission for this action", 403, "FORBIDDEN");
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
