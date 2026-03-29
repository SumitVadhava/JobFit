const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
    required: true
  },
  img: {
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
    type: String,
    required: false,
    default: "0-2 years"
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
  }
});

module.exports = mongoose.model("candidateProfile", candidateProfileSchema);
