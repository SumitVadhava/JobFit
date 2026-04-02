const AdminDashboard = require("../models/adminDashboard");
const User = require("../models/users");
const CandidateProfile = require("../models/candidateProfile");
const RecruiterProfile = require("../models/recruiterProfile");
const Job = require("../models/jobs");
const Application = require("../models/applications");
const { ROLES } = require("../utils/roles");
const mongoose = require("mongoose");

// GET -> api/admin/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: ROLES.CANDIDATE });
    const totalRecruiter = await User.countDocuments({ role: ROLES.RECRUITER });
    const totalJobs = await Job.countDocuments({});
    const totalCompanies = (await Job.distinct("companyName")).length;
    
    // Resume evaluated can be the total number of applications
    const resumeEvaluated = await Application.countDocuments({});

    const data = {
      totalCandidates,
      totalRecruiter,
      totalJobs,
      totalCompanies,
      resumeEvaluated,
      userActivityByTime: 15, // Default/Placeholder as per model
      jobPostsByIndustry: 8,  // Default/Placeholder as per model
    };

    res.status(200).json({
      error: false,
      message: "Admin dashboard stats calculated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error while calculating dashboard stats",
      details: error.message,
    });
  }
};

// GET -> api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    // Return both candidates and recruiters
    const users = await User.find({
      role: { $in: [ROLES.CANDIDATE, ROLES.RECRUITER] },
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      error: false,
      message: "Operation successful",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};

// PATCH -> api/admin/users/:id
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Update User Collection
    if (userName) user.userName = userName;
    if (email) user.email = email;
    await user.save();

    // Update Profile Collection based on role
    if (user.role === ROLES.CANDIDATE) {
      await CandidateProfile.findOneAndUpdate(
        { user: id },
        { userName, email },
        { new: true }
      );
    } else if (user.role === ROLES.RECRUITER) {
      await RecruiterProfile.findOneAndUpdate(
        { user: id },
        { userName, email },
        { new: true }
      );
    }

    res.status(200).json({
      error: false,
      message: "User and profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};

// DELETE -> api/admin/users/{id}
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Delete User
    await User.findByIdAndDelete(id);

    // Delete Profile based on role
    if (user.role === ROLES.CANDIDATE) {
      await CandidateProfile.findOneAndDelete({ user: id });
    } else if (user.role === ROLES.RECRUITER) {
      await RecruiterProfile.findOneAndDelete({ user: id });
    }

    res.status(200).json({
      error: false,
      message: "User and profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};
