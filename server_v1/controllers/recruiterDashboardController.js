const mongoose = require("mongoose");
const Job = require("../models/jobs");
const Application = require("../models/applications");

/**
 * Get recruiter dashboard analytics
 */
const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const totalJobsPosted = await Job.countDocuments({ recruiterId });
    const recruiterJobs = await Job.find({ recruiterId }, "_id jobTitle");

    if (recruiterJobs.length === 0) {
      return res.status(200).json({
        error: false,
        message: "Dashboard analytics retrieved (No jobs posted).",
        data: {
          recruiterId,
          totalJobsPosted: 0,
          totalApplications: 0,
          avgApplicationsPerJob: 0,
          applicationsPerJob: [],
          topPerformingJob: null,
        },
      });
    }

    const jobIds = recruiterJobs.map((job) => job._id);

    const applicationsPerJob = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: "$jobId",
          applicationCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $project: {
          jobId: "$_id",
          jobTitle: "$job.jobTitle",
          applicationCount: 1,
        },
      },
      { $sort: { applicationCount: -1 } },
    ]);

    const totalApplications = applicationsPerJob.reduce((sum, job) => sum + job.applicationCount, 0);
    const avgApplicationsPerJob = totalJobsPosted > 0 ? (totalApplications / totalJobsPosted).toFixed(2) : 0;

    const topPerformingJob =
      applicationsPerJob.length > 0
        ? {
            jobId: applicationsPerJob[0].jobId,
            jobTitle: applicationsPerJob[0].jobTitle,
            applicationCount: applicationsPerJob[0].applicationCount,
          }
        : null;

    res.status(200).json({
      error: false,
      message: "Dashboard analytics retrieved successfully.",
      data: {
        recruiterId,
        totalJobsPosted,
        totalApplications,
        avgApplicationsPerJob: parseFloat(avgApplicationsPerJob),
        applicationsPerJob,
        topPerformingJob,
      },
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch dashboard analytics." });
  }
};

module.exports = {
  getRecruiterDashboard,
};