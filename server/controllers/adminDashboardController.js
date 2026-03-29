const AdminDashboard = require("../models/adminDashboard");
const Login = require("../models/login");
const Job = require("../models/jobs");
const CandidateProfile = require("../models/candidateProfile");

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

exports.getUsersData = async (req, res) => {
  try {
    const users = await Login.find({ role: { $in: ["candidate", "user"] } }).select("userName email role status");
    res.status(200).json({ error: false, data: users });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: true, message: "userId is required" });
    }
    
    const deletedUser = await Login.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.status(200).json({ error: false, message: "Operation successful", data: {} });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
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
    const { userId } = req.params;
    const existing = await CandidateProfile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: true, message: "Profile already exists" });
    }
    
    const newProfile = await CandidateProfile.create({ user: userId, ...req.body });
    res.status(201).json({ error: false, message: "Profile created", data: newProfile });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

exports.getCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ error: true, message: "Profile not found" });
    res.status(200).json({ error: false, message: "Operation successful", data: profile });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

exports.updateCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedProfile = await CandidateProfile.findOneAndUpdate(
      { user: userId },
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProfile) return res.status(404).json({ error: true, message: "Profile not found" });
    res.status(200).json({ error: false, message: "Profile updated", data: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};

exports.deleteCandidateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await CandidateProfile.findOneAndDelete({ user: userId });
    if (!deleted) return res.status(404).json({ error: true, message: "Profile not found" });
    res.status(200).json({ error: false, message: "Profile deleted", data: {} });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error", data: null });
  }
};
