const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userModel: {
      type: String,
      enum: ["logins", "google_logins"],
      default: "logins",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: true,
    },
    savedAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
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

savedJobSchema.index({ userId: 1, userModel: 1, jobId: 1 }, { unique: true });
savedJobSchema.index({ userId: 1, userModel: 1, savedAt: -1 });

module.exports = mongoose.model("saved_jobs", savedJobSchema);
