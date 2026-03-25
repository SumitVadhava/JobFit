const Profile = require("../models/profiles");

/**
 * Shared validation logic for profile data (used for both CREATE and UPDATE)
 * @param {Object} body - Request body
 * @returns {String|null} Error message or null if valid
 */
const validateProfileData = (body) => {
  const { img, description, experience, atsScore, education, skills } = body;

  // Validate experience array items
  if (experience !== undefined) {
    if (!Array.isArray(experience)) return "experience must be an array";
    for (const exp of experience) {
      if (
        !exp.jobTitle ||
        !exp.companyName ||
        !exp.role ||
        exp.expYear === undefined
      ) {
        return "Each experience item must have: jobTitle, companyName, role, expYear";
      }
    }
  }

  // Validate education array items
  if (education !== undefined) {
    if (!Array.isArray(education)) return "education must be an array";
    for (const edu of education) {
      if (!edu.degree || !edu.university || edu.yearOfPassing === undefined) {
        return "Each education item must have: degree, university, yearOfPassing";
      }
    }
  }

  // Validate skills array items
  if (skills !== undefined) {
    if (!Array.isArray(skills)) return "skills must be an array";
    for (const skill of skills) {
      if (typeof skill !== 'object' || !skill.skillName) {
        return "Each skill item must be an object with: skillName";
      }
    }
  }

  // Validate atsScore if provided
  if (atsScore !== undefined && typeof atsScore !== 'number') {
    return "atsScore must be a number";
  }

  return null;
};

// Middleware for PUT /api/profile
const validateUpdateProfile = (req, res, next) => {
  const { img, description, experience, atsScore, education, skills } = req.body;

  const hasAtLeastOneField =
    img !== undefined ||
    description !== undefined ||
    experience !== undefined ||
    atsScore !== undefined ||
    education !== undefined ||
    skills !== undefined;

  if (!hasAtLeastOneField) {
    return res.status(400).json({
      message:
        "Missing required fields: provide at least one of img, description, experience, atsScore, education, or skills",
    });
  }

  const error = validateProfileData(req.body);
  if (error) return res.status(400).json({ message: error });

  next();
};

// Middleware for POST /api/profile
const validateCreateProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 1. Check if profile already exists
    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        message: "Profile already exists. Use PUT to update it.",
      });
    }

    // 2. Validate structure of incoming data
    const error = validateProfileData(req.body);
    if (error) return res.status(400).json({ message: error });

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { validateUpdateProfile, validateCreateProfile };
