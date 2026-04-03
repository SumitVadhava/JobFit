const mongoose = require("mongoose");

const adminDashboardSchema = new mongoose.Schema(
  {
    totalSeekers: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRecruiter: {
      type: Number,
      required: true,
      default: 0,
    },
    totalJobs: {
      type: Number,
      required: true,
      default: 0,
    },
    resumeEvaluated: {
      type: Number,
      required: true,
      default: 0,
    },
    userActivityByTime: {
      type: Number,
      required: true,
      default: 15,
    },
    jobPostsByIndustry: {
      type: Number,
      required: false,
      default: 8,
    },
    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
  }
);
module.exports = mongoose.model("adminDashboard", adminDashboardSchema);