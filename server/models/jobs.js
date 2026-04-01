const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recruiterModel: {
      type: String,
      enum: ["logins", "google_logins"],
      default: "logins",
      required: true,
    },
    openings: {
      type: Number,
      min: 0,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    workPlaceType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
      default: null,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
    adminReview: {
      type: String,
      enum: ["pending", "reviewed", "risky"],
      default: "pending",
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
    timestamps: false,
  },
);

module.exports = mongoose.model("jobs", jobSchema);
