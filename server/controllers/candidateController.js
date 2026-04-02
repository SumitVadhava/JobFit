const mongoose = require("mongoose");
const Application = require("../models/applications");
const SavedJob = require("../models/savedJobs");
const AtsHistory = require("../models/atsHistory");
const CandidateProfile = require("../models/candidateProfile");
const User = require("../models/users");

/**
 * Get candidate dashboard stats
 */
const getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalSavedJobs = await SavedJob.countDocuments({ userId });
    const totalAppliedJobs = await Application.countDocuments({ candidateId: userId });

    const latestAts = await AtsHistory.findOne({ userId }).sort({ updatedAt: -1 });
    const avgAtsScore = latestAts
      ? latestAts.atsScores.reduce((sum, item) => sum + item.score, 0) / (latestAts.atsScores.length || 1)
      : 0;

    res.status(200).json({
      error: false,
      message: "Dashboard stats retrieved successfully.",
      data: {
        totalSavedJobs,
        totalAppliedJobs,
        atsTracker: {
          latestAtsHistory: latestAts || null,
          averageScore: Number(avgAtsScore.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch dashboard stats." });
  }
};

/**
 * Get ATS analysis history
 */
const getCandidateAtsAnalyzer = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await AtsHistory.findOne({ userId });
    if (!history) {
      return res.status(200).json({
        error: false,
        message: "No ATS history found.",
        data: { atsScores: [] },
      });
    }

    res.status(200).json({
      error: false,
      message: "ATS history retrieved successfully.",
      data: { atsScores: history.atsScores },
    });
  } catch (error) {
    console.error("ATS Analyzer Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch ATS history." });
  }
};

/**
 * Get candidate profile
 */
const getCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: true, message: "Candidate profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Candidate profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch profile." });
  }
};

/**
 * Get candidate profile by ID
 */
const getCandidateProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ error: true, message: "Invalid profile ID" });
    }

    const profile = await CandidateProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: true, message: "Candidate profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Candidate profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile By ID Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch profile." });
  }
};

/**
 * Create candidate profile
 */
const createCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, userName, img, resumeLink, description, experience, education, skills, softSkills } = req.body;

    // Check if profile already exists
    const existingProfile = await CandidateProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ error: true, message: "Candidate profile already exists. Use PUT to update." });
    }

    const newProfile = new CandidateProfile({
      user: userId,
      email: email || null,
      userName: userName || null,
      img: img || null,
      resumeLink: resumeLink || null,
      description: description || null,
      experience: experience || "0-2 years",
      education: education || [],
      skills: skills || [],
      softSkills: softSkills || [],
    });

    await newProfile.save();

    res.status(201).json({
      error: false,
      message: "Candidate profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to create profile." });
  }
};

/**
 * Update candidate profile
 */
const updateCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, userName, img, resumeLink, description, experience, education, skills, softSkills, atsScore } = req.body;

    if (email !== undefined) {
      return res.status(400).json({ error: true, message: "Email changes are not allowed through this endpoint." });
    }

    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (img !== undefined) updateData.img = img;
    if (resumeLink !== undefined) updateData.resumeLink = resumeLink;
    if (description !== undefined) updateData.description = description;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    if (softSkills !== undefined) updateData.softSkills = softSkills;
    if (atsScore !== undefined) updateData.atsScore = atsScore;

    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: true, message: "Candidate profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Candidate profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to update profile." });
  }
};

/**
 * Delete candidate profile
 */
const deleteCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await CandidateProfile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({ error: true, message: "Candidate profile not found." });
    }

    // Now delete the user record from the users collection
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      error: false,
      message: "Candidate profile deleted successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to delete profile." });
  }
};

module.exports = {
  getCandidateDashboard,
  getCandidateAtsAnalyzer,
  getCandidateProfile,
  getCandidateProfileById,
  createCandidateProfile,
  updateCandidateProfile,
  deleteCandidateProfile,
};
