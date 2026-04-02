const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: false,
      trim: true,
    },
    openings: {
      type: Number,
      required: true,
      min: 0,
    },
    experience: {
      type: String,
      required: false,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    workPlaceType: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },
    img: {
      type: String,
      required: false,
      default: null,
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
  { timestamps: false }
);

module.exports = mongoose.model("jobs", jobsSchema);