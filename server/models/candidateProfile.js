const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
    required: true
  },
  name: {
    type: String,
    required: false,
    default: null
  },
  email: {
    type: String,
    required: false,
    default: null
  },
  userName: {
    type: String,
    required: false,
    default: null
  },
  img: {
    type: String,
    required: false,
    default: null
  },
  resumeLink: {
    type: String,
    required: false,
    default: null
  },
  description: {
    type: String,
    required: false,
    default: null
  },
  atsScore: {
    type: Number,
    required: false,
    default: 0
  },
  experience: {
    type: [
      {
        jobTitle: { type: String, required: true },
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        expYear: { type: Number, required: true }
      }
    ],
    default: []
  },
  education: {
    type: [
      {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        yearOfPassing: { type: Number, required: true }
      }
    ],
    default: []
  },
  skills: {
    type: [
      {
        skillName: { type: String, required: true }
      }
    ],
    default: []
  },
  softSkills: {
    type: [
      {
        skillName: { type: String, required: true }
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("candidateProfile", candidateProfileSchema);
