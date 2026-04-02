const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { ROLES } = require("../utils/roles");
const { sendOtp, verifyOtp } = require("../services/otp.service");
require("dotenv").config();


const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, picture: user.picture, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};


exports.signup = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "User with this email already exists.",
      });
    }


    if (role && !Object.values(ROLES).includes(role)) {
      return res.status(400).json({ error: true, message: "Invalid role." });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      authProvider: "local",
      role: role || ROLES.CANDIDATE,
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      error: false,
      message: "User registered successfully.",
      data: {
        token: generateToken(newUser),
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: true,
      message: "Server error during registration.",
      details: error.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || user.authProvider !== "local") {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      error: false,
      message: "Login successful.",
      data: {
        token: generateToken(user),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: true,
      message: "Server error during login.",
      details: error.message,
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { id_token, role } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: true, message: "ID Token is required." });
    }

    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );

    const { sub: google_id, email, name, picture } = response.data;

    if (!email) {
      return res.status(400).json({ error: true, message: "Google account must have an email." });
    }

    let user = await User.findOne({ email });

    if (user) {

      if (!user.google_id) {
        user.google_id = google_id;
        user.authProvider = "google";
        await user.save();
      }
    }
    else {
      user = new User({
        userName: name || email.split("@")[0],
        email,
        google_id,
        picture,
        authProvider: "google",
        role: role || ROLES.CANDIDATE,
      });
      await user.save();
    }

    res.status(200).json({
      error: false,
      message: "Google login successful.",
      data: {
        token: generateToken(user),
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({
      error: true,
      message: "Invalid Google token.",
      details: error.response?.data || error.message,
    });
  }
};


exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        error: false,
        message: "User already exists.",
        alreadyRegistered: true
      });
    }

    await sendOtp(email);

    res.status(200).json({
      error: false,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to send OTP.",
      details: error.message,
    });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: true, message: "Email and OTP are required." });
    }

    const isValid = verifyOtp(email, otp);

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid or expired OTP.",
      });
    }

    res.status(200).json({
      error: false,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      error: true,
      message: "Server error during OTP verification.",
    });
  }
};