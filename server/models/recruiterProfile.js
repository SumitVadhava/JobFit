const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
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
  company: {
    type: String,
    required: false,
    default: null
  },
  position: {
    type: String,
    required: false,
    default: null
  },
  description: {
    type: String,
    required: false,
    default: null
  },
  website: {
    type: String,
    required: false,
    default: null
  },
  location: {
    type: String,
    required: false,
    default: null
  }
});

module.exports = mongoose.model("recruiterProfile", recruiterProfileSchema);
