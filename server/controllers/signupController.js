const User = require("../models/login");
const CandidateProfile = require("../models/candidateProfile");
const RecruiterProfile = require("../models/recruiterProfile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../utils/roles");

const addSingupController = async (req, res) => {
  const { userName, email, password, role, status } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role,
      status,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        userModel: "logins",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    if (!token)
      return res.status(500).json({ message: "Error generating token" });

    await newUser.save();

    // Auto-create profile with name & email based on role
    if (role === ROLES.RECRUITER) {
      const existingProfile = await RecruiterProfile.findOne({
        user: newUser._id,
      });
      if (!existingProfile) {
        await RecruiterProfile.create({
          user: newUser._id,
          name: userName,
          email: email,
          userName: userName,
        });
      }
    } else {
      // candidate, user, or any other non-admin role
      const existingProfile = await CandidateProfile.findOne({
        user: newUser._id,
      });
      if (!existingProfile) {
        await CandidateProfile.create({
          user: newUser._id,
          name: userName,
          email: email,
          userName: userName,
        });
      }
    }

    const safeUser = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };

    return res.status(201).json({
      message: "User saved successfully",
      user: safeUser,
      token: token,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addSingupController };
