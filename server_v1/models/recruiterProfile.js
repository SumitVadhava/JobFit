const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'logins',
    required: true,
    unique: true,
  },

  email: { type: String, default: null },
  userName: { type: String, default: null },
  img: { type: String, default: null },

  company: { type: String, default: null },
  position: { type: String, default: null },


  description: { type: String, default: null },

  location: { type: String, default: null },
  website: { type: String, default: null },
  linkedIn: { type: String, default: null },


  jobsPosted: { type: Number, default: 0 },
  candidatesHired: { type: Number, default: 0 },
  teamSize: { type: Number, default: 0 },


});

module.exports = mongoose.model('recruiterProfile', recruiterProfileSchema);