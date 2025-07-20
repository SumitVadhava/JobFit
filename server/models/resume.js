const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     // ref: 'User',
//     required: true
// },
  resumeName: {
    type: String,
    required: true,
    default: 'Untitled Resume'
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
        filetype: { type: String, required: false, default: 'application/pdf' },
      }
    ],
    required: true,
    default: []
  },
  atsScore: {
    type: Number,
    required: false,
    default: 0,
  },
  analysis: {
    type: Object,
    required: false,
    default: {}
  }
});

module.exports = mongoose.model("resume", resumeSchema);