const { protect, authorize } = require("./authMiddleware");
const { ROLES } = require("../utils/roles");
const Job = require("../models/jobs");
const Application = require("../models/applications");

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

const validateRecruiterProfileUpdate = (req, res, next) => {
  if (req.body.email !== undefined) {
    return res.status(400).json({ error: true, message: "Email changes are not allowed through profile update endpoints." });
  }
  next();
};

/**
 * Validate Job Deletion (Ownership & No applicants)
 */
const validateJobDeletion = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // 1. Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: true, message: "Job not found." });
    }

    // 2. Check ownership
    if (String(job.recruiterId) !== String(req.user.id)) {
      return res.status(403).json({ error: true, message: "Unauthorized to delete this job." });
    }

    // 3. Check for applicants
    const applicantCount = await Application.countDocuments({ jobId });
    if (applicantCount > 0) {
      return res.status(400).json({
        error: true,
        message: "This job cannot be deleted because it already has applicants.",
      });
    }

    next();
  } catch (error) {
    console.error("Validate Job Deletion Error:", error);
    res.status(500).json({ error: true, message: "Server error during job deletion validation." });
  }
};

module.exports = {
  recruiterAuth,
  validateJobPost,
  validateApplicationStatusUpdate,
  validateRecruiterProfileUpdate,
  validateJobDeletion,
};
