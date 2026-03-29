const Job = require("../models/jobs");
const AppliedJob = require("../models/appliedJobs");
const SavedJob = require("../models/savedJobs");
const mongoose = require("mongoose");
const { ROLES } = require("../utils/roles");

const ADMIN_REVIEW_STATUSES = ["pending", "reviewed", "risky"];

exports.createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newJob = new Job({
      recruiterId: req.user.id,
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    });
    const savedJob = await newJob.save();
    res
      .status(201)
      .json({ message: "Job created successfully", job: savedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ message: "Jobs retrieved successfully", jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job retrieved successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await AppliedJob.create({
      userId: req.user.id,
      jobId,
      status: "applied",
    });

    return res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You already applied to this job" });
    }

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findById(jobId).select("_id");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingSavedJob = await SavedJob.findOne({
      userId: req.user.id,
      jobId,
    }).select("_id");

    if (existingSavedJob) {
      return res.status(200).json({
        message: "Job already saved",
        saved: true,
      });
    }

    await SavedJob.create({
      userId: req.user.id,
      jobId,
    });

    return res.status(201).json({
      message: "Job saved successfully",
      saved: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const removed = await SavedJob.findOneAndDelete({
      userId: req.user.id,
      jobId,
    });

    if (!removed) {
      return res.status(404).json({
        message: "Saved job not found",
        saved: false,
      });
    }

    return res.status(200).json({
      message: "Job removed from saved jobs",
      saved: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getRecruiterOwnJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter id" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (String(req.user.id) !== String(recruiterId)) {
      return res.status(403).json({
        message: "Forbidden: you can only access your own created jobs",
      });
    }

    const jobs = await Job.find({ recruiterId });

    return res.status(200).json({
      message: "Recruiter jobs retrieved successfully",
      jobs,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const existingJob = await Job.findById(req.params.id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      !req.user?.id ||
      String(existingJob.recruiterId) !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only update your own jobs" });
    }

    const {
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        jobTitle,
        department,
        experience,
        responsibilities,
        qualifications,
        companyName,
        location,
        workPlaceType,
        jobDescription,
        img,
        bookmarked,
      },
      { new: true, runValidators: true },
    );
    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateJobAdminReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReview } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    if (!ADMIN_REVIEW_STATUSES.includes(adminReview)) {
      return res.status(400).json({
        message: `Invalid adminReview status. Allowed values: ${ADMIN_REVIEW_STATUSES.join(", ")}`,
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { adminReview },
      { new: true, runValidators: true },
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job admin review status updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const userRole = String(req.user?.role || "").toLowerCase();
    if (
      userRole !== ROLES.ADMIN &&
      (!req.user?.id || String(job.recruiterId) !== String(req.user.id))
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only delete your own jobs" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
