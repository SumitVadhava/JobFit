const User = require("../models/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ROLES } = require("../utils/roles");

const getLoginController = async (req, res) => {
  const { email, password, recruiterKey } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: true, message: "Invalid email credentials", data: null });
    }

    if (!user.password) {
      return res.status(400).json({ error: true, message: "Invalid credentials", data: null });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: "Invalid password credentials", data: null });
    }

    if (user.role === ROLES.RECRUITER && user.recruiterKey) {
      if (!recruiterKey) {
        return res.status(400).json({ error: true, message: "Recruiter key is required", data: null });
      }

      const isRecruiterKeyValid = await bcrypt.compare(recruiterKey, user.recruiterKey);
      if (!isRecruiterKeyValid) {
        return res.status(400).json({ error: true, message: "Invalid recruiter key", data: null });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    if (!token) {
      return res.status(500).json({ error: true, message: "Error generating token", data: null });
    }

    const safeUser = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    res.json({
      error: false,
      message: "Login successful",
      data: { token, user: safeUser }
    });
  } catch (err) {
    console.error("Login Server Error:", err);
    res.status(500).json({ error: true, message: "Server error: " + err.message, data: null });
  }
};

module.exports = { getLoginController };
