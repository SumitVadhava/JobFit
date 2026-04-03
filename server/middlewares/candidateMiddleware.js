const { protect, authorize } = require("./authMiddleware");
const { ROLES } = require("../utils/roles");

/**
 * Candidate Authentication Middleware
 */
const candidateAuth = [protect, authorize(ROLES.CANDIDATE)];

/**
 * Validate Job Application
 */
const validateJobApplication = (req, res, next) => {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: true, message: "Job ID is required for application." });
  }
  next();
};

/**
 * Validate Saved Job Status
 */
const validateSavedJob = (req, res, next) => {
  const { saved } = req.body;
  if (saved === undefined || typeof saved !== "boolean") {
    return res.status(400).json({ error: true, message: "Saved status must be a boolean (true or false)." });
  }
  next();
};

/**
 * Validate Job Action (e.g. withdraw)
 */
const validateWithdrawal = (req, res, next) => {
  const { action } = req.body;
  if (action !== "withdraw") {
    return res.status(400).json({ error: true, message: "Invalid action. Only 'withdraw' is supported." });
  }
  next();
};

const validateCandidateProfileUpdate = (req, res, next) => {
  if (req.body.email !== undefined) {
    return res.status(400).json({ error: true, message: "Email changes are not allowed through profile update endpoints." });
  }
  next();
};

module.exports = {
  candidateAuth,
  validateJobApplication,
  validateSavedJob,
  validateWithdrawal,
  validateCandidateProfileUpdate,
};