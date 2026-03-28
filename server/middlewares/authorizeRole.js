module.exports = (...allowedRoles) => {
  const allowed = new Set(
    allowedRoles.map((role) => String(role).toLowerCase()),
  );

  return (req, res, next) => {
    const userRole = String(req.user?.role || "").toLowerCase();

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
