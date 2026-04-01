const User = require("./../models/google_login");
const CandidateProfile = require("../models/candidateProfile");
const RecruiterProfile = require("../models/recruiterProfile");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../utils/roles");
require("dotenv").config();

const googleAddLoginController = async (req, res) => {
  const { name, email, picture, google_id, role } = req.body;

  try {
    let existingUser = await User.findOne({ google_id: google_id });
    let isNewUser = false;

    if (!existingUser) {
      const newUser = new User({
        userName: name,
        email: email,
        picture: picture,
        google_id: google_id,
        role: role,
      });

      await newUser.save();
      userToUse = newUser;
      isNewUser = true;
    } else {
      userToUse = existingUser;
    }

    // Auto-create profile with name & email on first Google login
    if (isNewUser) {
      if (role === ROLES.RECRUITER) {
        const existingProfile = await RecruiterProfile.findOne({
          user: userToUse._id,
        });
        if (!existingProfile) {
          await RecruiterProfile.create({
            user: userToUse._id,
            name: name,
            email: email,
            userName: name,
            img: picture || null,
          });
        }
      } else {
        const existingProfile = await CandidateProfile.findOne({
          user: userToUse._id,
        });
        if (!existingProfile) {
          await CandidateProfile.create({
            user: userToUse._id,
            name: name,
            email: email,
            userName: name,
            img: picture || null,
          });
        }
      }
    }

    const token = jwt.sign(
      {
        id: userToUse._id,
        email: userToUse.email,
        role: userToUse.role,
        userModel: "google_logins",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    if (!token)
      return res.status(500).json({ message: "Error generating token" });

    const message = existingUser
      ? "User already exists"
      : "User signup successfully";

    const safeUser = {
      _id: userToUse._id,
      userName: userToUse.userName,
      email: userToUse.email,
      picture: userToUse.picture,
      role: userToUse.role,
    };

    return res.status(200).json({
      message,
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { googleAddLoginController };
