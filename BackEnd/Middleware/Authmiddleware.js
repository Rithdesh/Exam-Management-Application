const jwt = require("jsonwebtoken");

/**
 * Authenticate JWT
 */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, roles, ... }

    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/**
 * Role Authorization
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.roles) {
        return res.status(403).json({
          message: "Access denied",
          error: "User roles not found",
        });
      }

      // Convert both sides to uppercase strings
      const userRoles = Array.isArray(req.user.roles)
        ? req.user.roles.map(r => String(r).toUpperCase())
        : [String(req.user.roles).toUpperCase()];

      const requiredRoles = allowedRoles.map(r =>
        String(r).toUpperCase()
      );

      const hasAccess = requiredRoles.some(role =>
        userRoles.includes(role)
      );

      if (!hasAccess) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error.message);
      return res.status(403).json({
        message: "Authorization error",
      });
    }
  };
};

module.exports = { authenticateJWT, authorizeRoles };
