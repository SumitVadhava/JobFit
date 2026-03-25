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
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset
        return new Date(now.getTime() + istOffset);
      },
    },
  },
  {
    timestamps: true,
  },
);

// One user can apply to many jobs, but only once per job.
appliedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
appliedJobSchema.index({ userId: 1, appliedAt: -1 });
appliedJobSchema.index({ jobId: 1, appliedAt: -1 });

module.exports = mongoose.model("applied_jobs", appliedJobSchema);

/*
{ userId: 1, jobId: 12, status: "applied", appliedAt: t1 }
{ userId: 1, jobId: 232, status: "shortlisted", appliedAt: t2 }
{ userId: 1, jobId: 4554, status: "rejected", appliedAt: t3 }
{ userId: 1, jobId: 2323, status: "accepted", appliedAt: t4 }


*/
