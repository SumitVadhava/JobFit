const { protect, authorize } = require("./authMiddleware");
const { ROLES } = require("../utils/roles");

/**
 * Admin Authentication Middleware
 */
const adminAuth = [protect, authorize(ROLES.ADMIN)];

/**
 * Validate User Update (Admin and Candidate/Recruiter can update profile)
 */
const validateUserUpdate = (req, res, next) => {
  const { userName, email } = req.body;
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: true, message: "Invalid email format." });
  }

  next();
};

/**
 * Validate Job Status Update
 */
const validateJobStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["pending", "verified", "risky"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: true,
      message: `Invalid status value. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

module.exports = {
  adminAuth,
  validateUserUpdate,
  validateJobStatusUpdate,
};
