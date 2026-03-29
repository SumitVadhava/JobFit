const AdminDashboard = require("../models/adminDashboard");
const Login = require("../models/login");
const Job = require("../models/jobs");
const CandidateProfile = require("../models/candidateProfile");
const mongoose = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const dashboardData = await AdminDashboard.findOne({});
    if (!dashboardData) {
      return res.status(404).json({ message: "Dashboard data not found" });
    }
    res.status(200).json({ error: false, message: "Operation successful", data: dashboardData });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

// Get all accounts (all roles) — candidates, recruiters, users
exports.getUsersData = async (req, res) => {
  try {
    const users = await Login.find({}).select("userName email role status");
    res.status(200).json({ error: false, data: users });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

// Create a new user account (any role)
exports.createUser = async (req, res) => {
  const bcrypt = require("bcrypt");
  try {
    const { userName, email, password, role, status } = req.body;
    if (!userName || !email || !password || !role) {
      return res.status(400).json({ error: true, message: "userName, email, password and role are required", data: null });
    }
    const existing = await Login.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: true, message: "Email already registered", data: null });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Login.create({ userName, email, password: hashedPassword, role, status: status || "active" });
    const safeUser = { _id: newUser._id, userName: newUser.userName, email: newUser.email, role: newUser.role, status: newUser.status };
    res.status(201).json({ error: false, message: "User created successfully", data: safeUser });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

// Update any user account (candidate or recruiter) by userId
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const allowedFields = ["userName", "email", "role", "status"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: true, message: "No valid fields provided to update", data: null });
    }
    const updatedUser = await Login.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("userName email role status");
    if (!updatedUser) {
      return res.status(404).json({ error: true, message: "User not found", data: null });
    }
    res.status(200).json({ error: false, message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: true, message: "userId is required", data: null });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const deletedUser = await Login.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: true, message: "User not found", data: null });
    }
    res.status(200).json({ error: false, message: "Operation successful", data: {} });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

exports.getRecruitersData = async (req, res) => {
  try {
    const recruiters = await Login.find({ role: "recruiter" }).select("userName email role status");
    res.status(200).json({ error: false, message: "Operation successful", data: recruiters });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

exports.getJobsData = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ error: false, data: jobs });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

exports.getCompaniesData = async (req, res) => {
  try {
    const companies = await Job.distinct("companyName");
    res.status(200).json({ error: false, message: "Operation successful", data: companies });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

// --- Candidate Profile Admin CRUD ---

exports.createCandidateProfile = async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: true, message: "userId is required in request body", data: null });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const existing = await CandidateProfile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: true, message: "Profile already exists for this user", data: null });
    }
    const newProfile = await CandidateProfile.create({ user: userId, ...profileData });
    res.status(201).json({ error: false, message: "Profile created", data: newProfile });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

exports.getCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ error: true, message: "Profile not found", data: null });
    res.status(200).json({ error: false, message: "Operation successful", data: profile });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

exports.updateCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: userId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProfile) return res.status(404).json({ error: true, message: "Profile not found", data: null });
    res.status(200).json({ error: false, message: "Profile updated", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

exports.deleteCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const deleted = await CandidateProfile.findOneAndDelete({ user: userId });
    if (!deleted) return res.status(404).json({ error: true, message: "Profile not found", data: null });
    res.status(200).json({ error: false, message: "Profile deleted", data: {} });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};
