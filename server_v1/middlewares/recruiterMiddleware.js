const { protect, authorize } = require("./authMiddleware");
const { ROLES } = require("../utils/roles");

/**
 * Recruiter Authentication Middleware
 */
const recruiterAuth = [protect, authorize(ROLES.RECRUITER)];

/**
 * Validate Job Posting
 */
const validateJobPost = (req, res, next) => {
  const { jobTitle, companyName, location, openings } = req.body;

  if (!jobTitle) return res.status(400).json({ error: true, message: "Job title is required." });
  if (!companyName) return res.status(400).json({ error: true, message: "Company name is required." });
  if (!location) return res.status(400).json({ error: true, message: "Location is required." });

  if (openings !== undefined) {
    const openingsParsed = parseInt(openings, 10);
    if (isNaN(openingsParsed) || openingsParsed < 0) {
      return res.status(400).json({ error: true, message: "Valid number of openings is required." });
    }
  }

  next();
};

/**
 * Validate Application Status Update
 */
const validateApplicationStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ["applied", "shortlisted", "hired", "rejected"];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: true,
      message: `Invalid status value. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

module.exports = {
  recruiterAuth,
  validateJobPost,
  validateApplicationStatusUpdate,
};
