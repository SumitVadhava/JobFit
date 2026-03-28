const Profile = require("../models/profiles");
const handleError = (res, error, defaultMessage = "Server error") => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message, errors: error.errors });
  }
  res.status(500).json({ message: defaultMessage, error: error.message });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile retrieved successfully", profile });
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

    const { img, description, experience, atsScore, education, skills } = req.body;

    const profile = await Profile.create({
      user: userId,
      img: img || null,
      description: description || null,
      experience: experience || [],
      atsScore: atsScore || 0,
      education: education || [],
      skills: skills || [],
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

    const { img, description, atsScore, experience, education, skills } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { img, description, atsScore, experience, education, skills },
      { new: true, upsert: true, runValidators: true },
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

    const deleted = await Profile.findOneAndDelete({ user: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting profile");
  }
};