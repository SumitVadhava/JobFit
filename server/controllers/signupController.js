const User = require("../models/login");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../utils/roles");

const addSingupController = async (req, res) => {
  const { userName, email, password, role, status, recruiterKey } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    if (!existingUser) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const hashedRecruiterKey = recruiterKey
        ? await bcrypt.hash(recruiterKey, saltRounds)
        : null;

      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        role,
        status,
        recruiterKey: role === ROLES.RECRUITER ? hashedRecruiterKey : null,
      });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      if (!token)
        return res.status(500).json({ message: "Error generating token" });

      await newUser.save();

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
    } else {
      return res.status(409).json({
        message: "User already exists",
      });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addSingupController };
