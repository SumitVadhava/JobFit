const User = require("../models/login");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ROLES } = require("../utils/roles");

const getLoginController = async (req, res) => {
  const { email, password, recruiterKey } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid email credentials" });

    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password credentials" });

    if (user.role === ROLES.RECRUITER && user.recruiterKey) {
      if (!recruiterKey) {
        return res.status(400).json({ message: "Recruiter key is required" });
      }

      const isRecruiterKeyValid = await bcrypt.compare(
        recruiterKey,
        user.recruiterKey,
      );
      if (!isRecruiterKeyValid) {
        return res.status(400).json({ message: "Invalid recruiter key" });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    if (!token)
      return res.status(500).json({ message: "Error generating token" });

    const safeUser = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    res.json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getLoginController };
