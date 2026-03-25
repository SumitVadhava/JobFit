const Profile = require("../models/profiles");

const validateUpdateProfile = (req, res, next) => {
  const { img, description, experience, education, skills } = req.body;

  const hasAtLeastOneField =
    img !== undefined ||
    description !== undefined ||
    experience !== undefined ||
    education !== undefined ||
    skills !== undefined;

  if (!hasAtLeastOneField) {
    return res.status(400).json({
      message:
        "Missing required fields: provide at least one of img, description, experience, education, or skills",
    });
  }

  if (experience !== undefined) {
    if (!Array.isArray(experience)) {
      return res.status(400).json({ message: "experience must be an array" });
    }
    for (const exp of experience) {
      if (!exp.jobTitle || !exp.companyName || !exp.role || exp.expYear === undefined) {
        return res.status(400).json({
          message:
            "Each experience item must have: jobTitle, companyName, role, expYear",
        });
      }
    }
  }

  if (education !== undefined) {
    if (!Array.isArray(education)) {
      return res.status(400).json({ message: "education must be an array" });
    }
    for (const edu of education) {
      if (!edu.degree || !edu.university || edu.yearOfPassing === undefined) {
        return res.status(400).json({
          message:
            "Each education item must have: degree, university, yearOfPassing",
        });
      }
    }
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "skills must be an array" });
    }
    for (const skill of skills) {
      if (!skill.skillName) {
        return res
          .status(400)
          .json({ message: "Each skill item must have: skillName" });
      }
    }
  }

  next();
};

const validateCreateProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(409).json({
        message: "Profile already exists. Use PUT to update it.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { validateUpdateProfile, validateCreateProfile };
