const mongoose = require("mongoose");
const { type } = require("os");
const { ROLES } = require("../utils/roles");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  recruiterKey: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("logins", userSchema);
