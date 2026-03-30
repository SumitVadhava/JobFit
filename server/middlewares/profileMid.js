const Profile = require("../models/candidateProfile");

const validateProfileData = (body) => {
  const {
    img,
    description,
    experience,
    education,
    skills,
    softSkills,
    name,
    email,
  } = body;

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

  if (education !== undefined) {
    if (!Array.isArray(education)) return "education must be an array";
    for (const edu of education) {
      if (!edu.degree || !edu.university || edu.yearOfPassing === undefined) {
        return "Each education item must have: degree, university, yearOfPassing";
      }
    }
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) return "skills must be an array";
    for (const skill of skills) {
      if (typeof skill !== "object" || !skill.skillName) {
        return "Each skill item must be an object with: skillName";
      }
    }
  }

  if (softSkills !== undefined) {
    if (!Array.isArray(softSkills)) return "softSkills must be an array";
    for (const skill of softSkills) {
      if (typeof skill !== "object" || !skill.skillName) {
        return "Each softSkill item must be an object with: skillName";
      }
    }
  }

  return null;
};

const validateUpdateProfile = (req, res, next) => {
  const {
    img,
    description,
    experience,
    education,
    skills,
    softSkills,
    name,
    email,
  } = req.body;

  const hasAtLeastOneField =
    img !== undefined ||
    description !== undefined ||
    experience !== undefined ||
    education !== undefined ||
    skills !== undefined ||
    softSkills !== undefined ||
    name !== undefined ||
    email !== undefined;

  if (!hasAtLeastOneField) {
    console.error("Profile Middleware Error: Missing required fields");
    return res.status(400).json({
      message: "Missing required fields: provide at least one field to update",
    });
  }

  const error = validateProfileData(req.body);
  if (error) {
    console.error("Profile Middleware Validation Error:", error);
    return res.status(400).json({ message: error });
  }

  next();
};

const validateCreateProfile = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userModel = req.user?.userModel || "logins";

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existing = await Profile.findOne({
      user: userId,
      $or: [{ userModel }, { userModel: { $exists: false } }],
    });
    if (existing) {
      return res.status(409).json({
        message: "Profile already exists. Use PUT to update it.",
      });
    }

    const error = validateProfileData(req.body);
    if (error) return res.status(400).json({ message: error });

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { validateUpdateProfile, validateCreateProfile };
