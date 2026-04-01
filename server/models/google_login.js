const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  google_id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["candidate", "recruiter", "admin", "user"],
    required: true,
  },
});

module.exports = mongoose.model("google_logins", userSchema);
