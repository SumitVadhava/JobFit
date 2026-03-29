const jwt = require("jsonwebtoken");

module.exports = (...allowedRoles) => {
  const allowed = new Set(
    allowedRoles.map((role) => String(role).toLowerCase()),
  );

  return (req, res, next) => {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: true,
        data: null,
        message: "Unauthorized: No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: true,
        data: null,
        message: "Unauthorized: Invalid token",
      });
    }

    const userRole = String(decoded?.role || "").toLowerCase();

    if (!userRole) {
      return res.status(403).json({
        error: true,
        data: null,
        message: "Forbidden: role information is missing",
      });
    }

    if (!allowed.has(userRole)) {
      return res.status(403).json({
        error: true,
        data: null,
        message: "Forbidden: insufficient permissions",
      });
    }

    return next();
  };
};
