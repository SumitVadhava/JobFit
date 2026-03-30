const mongoose = require("mongoose");

const appliedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "logins",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "accepted"],
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(now.getTime() + istOffset);
      },
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

appliedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
appliedJobSchema.index({ userId: 1, appliedAt: -1 });
appliedJobSchema.index({ jobId: 1, appliedAt: -1 });

module.exports = mongoose.model("applied_jobs", appliedJobSchema);
