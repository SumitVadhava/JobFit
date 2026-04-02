const mongoose = require("mongoose");
const Job = require("../models/jobs");
const Application = require("../models/applications");
const SavedJob = require("../models/savedJobs");
const AtsHistory = require("../models/atsHistory");
const CandidateProfile = require("../models/candidateProfile");

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
 * Get all active jobs (openings > 0)
 */
const getCandidateJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ openings: { $gt: 0 } }).sort({ createdAt: -1 });

    res.status(200).json({
      error: false,
      message: "Active jobs retrieved successfully.",
      data: jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch jobs." });
  }
};

/**
 * Get job details by ID
 */
const getCandidateJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: true, message: "Invalid job ID format." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: true, message: "Job not found." });
    }

    res.status(200).json({
      error: false,
      message: "Job details retrieved successfully.",
      data: job,
    });
  } catch (error) {
    console.error("Get Job Detail Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch job details." });
  }
};

/**
 * Apply for a job
 */
const createAppliedJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: true, message: "Invalid job ID provided." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: true, message: "Job not found." });
    }

    if (job.openings <= 0) {
      return res.status(400).json({ error: true, message: "This job is no longer accepting applications." });
    }

    const existingApplication = await Application.findOne({ jobId, candidateId });
    if (existingApplication) {
      return res.status(400).json({ error: true, message: "You have already applied for this job." });
    }

    const newApplication = new Application({
      jobId,
      candidateId,
      status: "applied",
    });

    await newApplication.save();

    res.status(201).json({
      error: false,
      message: "Application submitted successfully.",
      data: newApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ error: true, message: "Failed to submit application." });
  }
};

/**
 * Withdraw application or update status
 */
const updateCandidateJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobId } = req.params;
    const { action } = req.body; // e.g., "withdraw"

    if (action !== "withdraw") {
      return res.status(400).json({ error: true, message: "Invalid action. Currently only 'withdraw' is supported." });
    }

    const application = await Application.findOneAndDelete({ jobId, candidateId });
    if (!application) {
      return res.status(404).json({ error: true, message: "No application found to withdraw." });
    }

    res.status(200).json({
      error: false,
      message: "Application withdrawn successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    res.status(500).json({ error: true, message: "Failed to withdraw application." });
  }
};

/**
 * Get all saved jobs
 */
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedJobs = await SavedJob.find({ userId }).populate("jobId");

    res.status(200).json({
      error: false,
      message: "Saved jobs retrieved successfully.",
      data: savedJobs,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch saved jobs." });
  }
};

/**
 * Toggle save/unsave status of a job
 */
const patchSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const { saved } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: true, message: "Invalid job ID" });
    }

    if (saved === undefined || typeof saved !== "boolean") {
      return res.status(400).json({ error: true, message: "Saved status must be a boolean (true or false)" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: true, message: "Job not found" });
    }

    let savedJobRecord = await SavedJob.findOne({ userId, jobId });

    if (!savedJobRecord) {
      if (saved) {
        // Create new saved job record
        savedJobRecord = new SavedJob({
          userId,
          jobId,
          saved: true,
        });
        await savedJobRecord.save();
        const populatedRecord = await SavedJob.findById(savedJobRecord._id).populate("jobId");
        return res.status(201).json({
          error: false,
          message: "Job saved successfully.",
          data: populatedRecord,
        });
      } else {
        // Trying to unsave a job that wasn't saved
        return res.status(404).json({ error: true, message: "Job was not saved by this candidate" });
      }
    }

    // Update existing record
    savedJobRecord.saved = saved;
    savedJobRecord.updatedAt = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    await savedJobRecord.save();

    const populatedRecord = await SavedJob.findById(savedJobRecord._id).populate("jobId");

    res.status(200).json({
      error: false,
      message: saved ? "Job saved successfully." : "Job unsaved successfully.",
      data: populatedRecord,
    });
  } catch (error) {
    console.error("Patch Saved Job Error:", error);
    res.status(500).json({ error: true, message: "Failed to update job saved status." });
  }
};

/**
 * Get all applications submitted by candidate
 */
const getAppliedJobs = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const applications = await Application.find({ candidateId }).populate("jobId");

    res.status(200).json({
      error: false,
      message: "Applications retrieved successfully.",
      data: applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch applications." });
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

    const updateData = {};
    if (email !== undefined) updateData.email = email;
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
  getCandidateJobs,
  getCandidateJobById,
  updateCandidateJob,
  getSavedJobs,
  patchSavedJob,
  getAppliedJobs,
  createAppliedJob,
};
