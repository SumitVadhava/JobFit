const Job = require("../models/jobs");
const mongoose = require("mongoose");

// GET -> api/admin/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("recruiterId", "userName email");
    res.status(200).json({
      error: false,
      message: "Operation successful",
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};

// PATCH -> api/admin/jobs/status/:id
exports.updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) {
      return res.status(404).json({
        error: true,
        message: "Job not found",
      });
    }
    res.status(200).json({
      error: false,
      message: "Job status updated successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};

// GET -> api/admin/companies
exports.getCompaniesData = async (req, res) => {
  try {
    const companies = await Job.aggregate([
      {
        $group: {
          _id: "$companyName",
          companyName: { $first: "$companyName" },
          companyPicture: { $first: "$img" },
          totalOpenings: { $sum: "$openings" },
        },
      },
      {
        $project: {
          _id: 0,
          companyName: 1,
          companyPicture: 1,
          totalOpenings: 1,
        },
      },
    ]);
    
    res.status(200).json({
      error: false,
      message: "Operation successful",
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Server error",
      details: error.message,
    });
  }
};
