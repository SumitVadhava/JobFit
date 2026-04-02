const mongoose = require("mongoose");
const { ROLES } = require("../utils/roles");

const usersSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
      default: null,
    },
    picture: {
      type: String,
      required: false,
      default: null,
    },
    google_id: {
      type: String,
      required: false,
      default: null,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    }
  },
);

module.exports = mongoose.model("users", usersSchema);
