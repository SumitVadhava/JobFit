const mongoose = require("mongoose");

const userDashboardSchema = new mongoose.Schema(
  {
    latestScore: {
      type: Number,
      default: 0,
    },
    bestScore: {
      type: Number,
      default: 0,
    },
    totalUploads: {
      type: Number,
      default: 0,
    },
    userActivityByTime: {
      type: Number,
      default: 15,
    },
    jobPostsByIndustry: {
      type: Number,
      default: 8,
    },
    metrics: {
      type: Map,
      of: Number,
      default: {},
    },
    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
  },
  {
    minimize: false,
  },
);

module.exports = mongoose.model("userDashboard", userDashboardSchema);