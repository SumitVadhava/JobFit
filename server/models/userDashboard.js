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
    strict: false,
    minimize: false,
    timestamps: false,
  },
);

module.exports = mongoose.model("userDashboard", userDashboardSchema);

/**
 *
 * basically this model is for storing the user dashboard data, which can be used to display the data on the frontend. It can also be used to store the data for the resume builder and job data. The metrics field is a map that can store any additional metrics that we want to track in the future without having to change the schema. This allows for flexibility and scalability as we can easily add new metrics without having to modify the existing schema.
 *  "metrics": { "savedJobsCount": 14, "atsScoreTrend": 6.2 }
 *  or
 *  "metrics": { "dailyActiveMinutes": 35 }
 *  or
 * "metrics": {
 *               "weeklyApplications": 12,
 *                  "interviewCalls": 3,
 *                  "profileViews": 57,
 *                  "resumeMatchAvg": 78.5
 *               }
 *
 */
