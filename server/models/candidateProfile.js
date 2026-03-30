const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userModel: {
    type: String,
    enum: ["logins", "google_logins"],
    default: "logins",
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: false,
    default: null,
  },
  userName: {
    type: String,
    required: false,
    default: null,
  },
  img: {
    type: String,
    required: false,
    default: null,
  },
  resumeLink: {
    type: String,
    required: false,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  atsScore: {
    type: Number,
    required: false,
    default: 0,
  },
  experience: {
    type: String,
    required: false,
    default: "0-2 years",
  },
  education: {
    type: [
      {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        yearOfPassing: { type: Number, required: true },
      },
    ],
    default: [],
  },
  skills: {
    type: [
      {
        skillName: { type: String, required: true },
      },
    ],
    default: [],
  },
  softSkills: {
    type: [
      {
        skillName: { type: String, required: true },
      },
    ],
    default: [],
  },
});

candidateProfileSchema.index({ user: 1, userModel: 1 }, { unique: true });

module.exports = mongoose.model("candidateProfile", candidateProfileSchema);
