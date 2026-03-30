const Profile = require("../models/candidateProfile");
const Login = require("../models/login");
const GoogleLogin = require("../models/google_login");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const fs = require("fs");

const USER_MODELS = {
  LOGIN: "logins",
  GOOGLE_LOGIN: "google_logins",
};

const resolveUserModelFromAuth = async (authUser) => {
  const tokenUserModel = authUser?.userModel;
  if (
    tokenUserModel === USER_MODELS.LOGIN ||
    tokenUserModel === USER_MODELS.GOOGLE_LOGIN
  ) {
    return tokenUserModel;
  }

  if (!authUser?.id || !mongoose.Types.ObjectId.isValid(authUser.id)) {
    return null;
  }

  const [loginExists, googleLoginExists] = await Promise.all([
    Login.exists({ _id: authUser.id }),
    GoogleLogin.exists({ _id: authUser.id }),
  ]);

  if (loginExists) {
    return USER_MODELS.LOGIN;
  }

  if (googleLoginExists) {
    return USER_MODELS.GOOGLE_LOGIN;
  }

  return null;
};

const buildProfileFilter = (userId, userModel) => ({
  user: userId,
  $or: [{ userModel }, { userModel: { $exists: false } }],
});

const removeTempFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to remove temporary upload file:", error.message);
    }
  }
};

const handleError = (res, error, defaultMessage = "Server error") => {
  console.error("Profile Controller Error:", error);
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: error.message, errors: error.errors });
  }
  res.status(500).json({ message: defaultMessage, error: error.message });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const profile = await Profile.findOne(
      buildProfileFilter(userId, userModel),
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res
      .status(200)
      .json({ message: "Profile retrieved successfully", profile });
  } catch (error) {
    handleError(res, error, "Error retrieving profile");
  }
};

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

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

    const profile = await Profile.create({
      user: userId,
      userModel,
      img: img || null,
      description: description || null,
      experience: experience || "0-2 years",
      atsScore: 0,
      education: education || [],
      skills: skills || [],
      softSkills: softSkills || [],
      name: name || null,
      email: email || null,
    });

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    handleError(res, error, "Error creating profile");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

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

    // Filter out null, undefined, or empty strings so we only perform a partial update
    const updates = {};
    if (img) updates.img = img;
    if (description) updates.description = description;
    if (experience) updates.experience = experience;
    if (education && Array.isArray(education)) updates.education = education;
    if (skills && Array.isArray(skills)) updates.skills = skills;
    if (softSkills && Array.isArray(softSkills))
      updates.softSkills = softSkills;
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedProfile = await Profile.findOneAndUpdate(
      buildProfileFilter(userId, userModel),
      { $set: { ...updates, userModel } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    handleError(res, error, "Error updating profile");
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const deleted = await Profile.findOneAndDelete(
      buildProfileFilter(userId, userModel),
    );

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting profile");
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "candidate_resumes",
      format: "pdf",
    });

    const updatedProfile = await Profile.findOneAndUpdate(
      buildProfileFilter(userId, userModel),
      { resumeLink: result.secure_url, userModel },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeLink: result.secure_url,
      profile: updatedProfile,
    });
  } catch (error) {
    handleError(res, error, "Error uploading resume");
  } finally {
    await removeTempFile(req.file?.path);
  }
};
