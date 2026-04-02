const mongoose = require("mongoose");

const atsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    atsScores: [
      {
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        analyzedAt: {
          type: Date,
          default: () => {
            const now = new Date();
            const istOffset = 5.5 * 60 * 60 * 1000;
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            return new Date(utc + istOffset);
          },
        },
      },
    ],
    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    },
  },
);

module.exports = mongoose.model("atsHistory", atsHistorySchema);
