const mongoose = require("mongoose");
const Job = require("../models/jobs");
const AppliedJob = require("../models/appliedJobs");
const SavedJob = require("../models/savedJobs");
const AtsHistory = require("../models/atsHistory");

const getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const totalSavedJobs = await SavedJob.countDocuments({ userId });
    const totalAppliedJobs = await AppliedJob.countDocuments({ userId });

    const latestAts = await AtsHistory.findOne({ userId }).sort({ updatedAt: -1 });
    const avgAtsScore = latestAts
      ? latestAts.atsScores.reduce((sum, item) => sum + item.score, 0) / (latestAts.atsScores.length || 1)
      : 0;

    res.json({
      userId,
      totalSavedJobs,
      totalAppliedJobs,
      atsTracker: {
        latestAtsHistory: latestAts || null,
        averageScore: Number(avgAtsScore.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Candidate dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCandidateAtsAnalyzer = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const history = await AtsHistory.findOne({ userId });
    if (!history) return res.json({ userId, atsScores: [] });

    res.json({ userId, atsScores: history.atsScores });
  } catch (error) {
    console.error("ATS analyzer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCandidateJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Candidate jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCandidateJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    console.error("Candidate job by id error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCandidateJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.params;
    const { action, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (action === "apply") {
      const applied = await AppliedJob.findOneAndUpdate(
        { userId, jobId },
        { status: status || "applied", updatedAt: new Date() },
        { new: true, upsert: true }
      );
      return res.json({ message: "Applied to job", applied });
    }

    if (action === "withdraw") {
      const applied = await AppliedJob.findOneAndUpdate(
        { userId, jobId },
        { status: "rejected", updatedAt: new Date() },
        { new: true }
      );
      if (!applied) return res.status(404).json({ message: "No application found to withdraw" });
      return res.json({ message: "Application withdrawn", applied });
    }

    res.status(400).json({ message: "Invalid action. Use apply or withdraw." });
  } catch (error) {
    console.error("Update candidate job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const savedJobs = await SavedJob.find({ userId }).populate("jobId");
    res.json(savedJobs);
  } catch (error) {
    console.error("Saved jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const appliedJobs = await AppliedJob.find({ userId }).populate("jobId");
    res.json(appliedJobs);
  } catch (error) {
    console.error("Applied jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createAppliedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await AppliedJob.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Create new application
    const appliedJob = new AppliedJob({
      userId,
      jobId,
      status: "applied",
    });

    await appliedJob.save();
    const populatedApplication = await AppliedJob.findById(appliedJob._id).populate("jobId");

    res.status(201).json({
      message: "Successfully applied to job",
      applied: populatedApplication,
    });
  } catch (error) {
    console.error("Create applied job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCandidateDashboard,
  getCandidateAtsAnalyzer,
  getCandidateJobs,
  getCandidateJobById,
  updateCandidateJob,
  getSavedJobs,
  getAppliedJobs,
  createAppliedJob,
};