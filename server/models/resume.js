const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "logins",
      required: true,
    },
    resumeName: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },
    resumeDate: {
      type: String,
      required: true,
    },
    resumeFiles: {
      type: [
        {
          filename: { type: String, required: true },
          filepath: { type: String, required: false },
          filetype: {
            type: String,
            required: false,
            default: "application/pdf",
          },
        },
      ],
      required: true,
      default: [],
    },
    atsScore: {
      type: Number,
      required: false,
      default: 0,
    },
    analysis: {
      type: Object,
      required: false,
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
    timestamps: false,
  },
);
module.exports = mongoose.model("resume", resumeSchema);
