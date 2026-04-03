const Job = require("../models/jobs");
const Application = require("../models/applications");
const SavedJob = require("../models/savedJobs");

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
 * Withdraw application
 */
const updateCandidateJob = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobId } = req.params;
    const { action } = req.body; // e.g., "withdraw"


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

module.exports = {
  getCandidateJobs,
  getCandidateJobById,
  createAppliedJob,
  updateCandidateJob,
  getSavedJobs,
  patchSavedJob,
  getAppliedJobs,
};
