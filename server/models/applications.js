const mongoose = require("mongoose");

const applicationsSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "hired", "rejected"],
      default: "applied",
      required: true,
    },
    appliedAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
    hiredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: false }
);

// Ensure a candidate can only apply for a specific job once
applicationsSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("applications", applicationsSchema);
