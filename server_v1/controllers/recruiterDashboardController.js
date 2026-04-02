const mongoose = require("mongoose");
const Job = require("../models/jobs");
const AppliedJob = require("../models/appliedJobs");
const { ROLES } = require("../utils/roles");

const getRecruiterDashboard = async (req, res) => {
  try {
    // Get recruiter ID from JWT token
    const recruiterId = req.user.id;

    // Verify user is a recruiter
    if (req.user.role !== ROLES.RECRUITER) {
      return res.status(403).json({
        error: true,
        message: "Access denied. Only recruiters can access dashboard."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter ID" });
    }

    const totalJobsPosted = await Job.countDocuments({ recruiterId });

    const recruiterJobs = await Job.find({ recruiterId }, '_id jobTitle');

    if (recruiterJobs.length === 0) {
      return res.status(200).json({
        recruiterId,
        totalJobsPosted: 0,
        totalApplications: 0,
        avgApplicationsPerJob: 0,
        applicationsPerJob: [],
        topPerformingJob: null
      });
    }

    const jobIds = recruiterJobs.map(job => job._id);

    const applicationsPerJob = await AppliedJob.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: "$jobId",
          applicationCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $project: {
          jobId: "$_id",
          jobTitle: "$job.jobTitle",
          applicationCount: 1
        }
      },
      { $sort: { applicationCount: -1 } }
    ]);

    const totalApplications = applicationsPerJob.reduce((sum, job) => sum + job.applicationCount, 0);

    const avgApplicationsPerJob = totalJobsPosted > 0 ? (totalApplications / totalJobsPosted).toFixed(2) : 0;

    const topPerformingJob = applicationsPerJob.length > 0 ? {
      jobId: applicationsPerJob[0].jobId,
      jobTitle: applicationsPerJob[0].jobTitle,
      applicationCount: applicationsPerJob[0].applicationCount
    } : null;

    const dashboardData = {
      recruiterId,
      totalJobsPosted,
      totalApplications,
      avgApplicationsPerJob: parseFloat(avgApplicationsPerJob),
      applicationsPerJob,
      topPerformingJob
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching recruiter dashboard:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getRecruiterDashboard,
};