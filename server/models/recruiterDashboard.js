const mongoose = require("mongoose");

const recruiterDashboardSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    index: true,
  },
  totalJobsPosted: {
    type: Number,
    required: true,
    default: 0,
  },
  totalApplications: {
    type: Number,
    required: true,
    default: 0,
  },
  avgApplicationsPerJob: {
    type: Number,
    required: true,
    default: 0,
  },
  applicationsPerJob: [
    {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
      applicationCount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  topPerformingJob: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: false,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    applicationCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  recentApplications: [
    {
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "applied_jobs",
        required: true,
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
      applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      applicantName: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected", "hired"],
        required: true,
        default: "applied",
      },
      appliedAt: {
        type: Date,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
  },
});

module.exports = mongoose.model("recruiterDashboard", recruiterDashboardSchema);
