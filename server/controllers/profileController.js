const Profile = require("../models/profiles");

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
    res
      .status(200)
      .json({ message: "Profile retrieved successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { img, description, experience, education, skills } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        img,
        description,
        experience,
        education,
        skills,
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
