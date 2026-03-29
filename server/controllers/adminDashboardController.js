const AdminDashboard = require("../models/adminDashboard");
const Login = require("../models/login");
const Job = require("../models/jobs");
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

// ─── Shared role-scoped helpers ───────────────────────────────────────────────

const createAccountOfRole = (role) => async (req, res) => {
  const bcrypt = require("bcrypt");
  try {
    const { userName, email, password, status } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: true, message: "userName, email and password are required", data: null });
    }
    const existing = await Login.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: true, message: "Email already registered", data: null });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Login.create({ userName, email, password: hashedPassword, role, status: status || "active" });
    const safeUser = { _id: newUser._id, userName: newUser.userName, email: newUser.email, role: newUser.role, status: newUser.status };
    res.status(201).json({ error: false, message: `${role} account created successfully`, data: safeUser });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

const updateAccountOfRole = (role) => async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const account = await Login.findById(userId);
    if (!account) return res.status(404).json({ error: true, message: "Account not found", data: null });
    if (account.role !== role) {
      return res.status(403).json({ error: true, message: `User is not a ${role}`, data: null });
    }
    const allowedFields = ["userName", "email", "status"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: true, message: "No valid fields provided to update", data: null });
    }
    const updated = await Login.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("userName email role status");
    res.status(200).json({ error: false, message: `${role} updated successfully`, data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

const deleteAccountOfRole = (role) => async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: true, message: "userId is required", data: null });
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: true, message: "Invalid userId format", data: null });
    }
    const account = await Login.findById(userId);
    if (!account) return res.status(404).json({ error: true, message: "Account not found", data: null });
    if (account.role !== role) {
      return res.status(403).json({ error: true, message: `User is not a ${role}`, data: null });
    }
    await Login.findByIdAndDelete(userId);
    res.status(200).json({ error: false, message: `${role} deleted successfully`, data: {} });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};

// ─── Candidate CRUD ───────────────────────────────────────────────────────────
exports.getCandidatesData = async (req, res) => {
  try {
    const candidates = await Login.find({ role: { $in: ["candidate", "user"] } }).select("userName email role status");
    res.status(200).json({ error: false, data: candidates });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};
exports.createCandidate = createAccountOfRole("candidate");
exports.updateCandidate = updateAccountOfRole("candidate");
exports.deleteCandidate = deleteAccountOfRole("candidate");

// ─── Recruiter CRUD ───────────────────────────────────────────────────────────
exports.getRecruitersData = async (req, res) => {
  try {
    const recruiters = await Login.find({ role: "recruiter" }).select("userName email role status");
    res.status(200).json({ error: false, message: "Operation successful", data: recruiters });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null });
  }
};
exports.createRecruiter = createAccountOfRole("recruiter");
exports.updateRecruiter = updateAccountOfRole("recruiter");
exports.deleteRecruiter = deleteAccountOfRole("recruiter");

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


