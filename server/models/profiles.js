const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
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
  experience: {
    type: [
      {
        jobTitle: { type: String, required: true },
        expYear: { type: Number, required: true },
        companyName: { type: String, required: true },
        role: { type: String, required: true }
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
  }
});

module.exports = mongoose.model("profiles", profileSchema);