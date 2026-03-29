const UserDashboard = require("../models/userDashboard");
const AppliedJob = require("../models/appliedJobs");
const SavedJob = require("../models/savedJobs");

exports.getUserDashboardData = async (req, res) => {
  try {
    const dashboardData = await UserDashboard.findOne({});
    if (!dashboardData) {
      return res.status(404).json({ message: "User dashboard data not found" });
    }
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getResumeBuilderData = async (req, res) => {
  try {
    const dashboardData = await UserDashboard.findOne(
      {},
      { latestScore: 1, bestScore: 1, totalUploads: 1, _id: 0 },
    );
    if (!dashboardData) {
      return res.status(404).json({ message: "Resume builder data not found" });
    }
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getJobData = async (req, res) => {
  try {
    const dashboardData = await UserDashboard.findOne(
      {},
      { jobPostsByIndustry: 1, userActivityByTime: 1, _id: 0 },
    );
    if (!dashboardData) {
      return res.status(404).json({ message: "Job data not found" });
    }
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSavedJobsData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const savedJobs = await SavedJob.find({ userId: req.user.id })
      .populate({
        path: "jobId",
        select:
          "companyName jobTitle location department workPlaceType experience jobDescription img",
      })
      .sort({ savedAt: -1 });

    const formattedSavedJobs = savedJobs
      .filter((entry) => entry.jobId)
      .map((entry) => ({
        savedId: entry._id,
        jobId: entry.jobId._id,
        companyName: entry.jobId.companyName,
        jobTitle: entry.jobId.jobTitle,
        location: entry.jobId.location,
        department: entry.jobId.department,
        workPlaceType: entry.jobId.workPlaceType,
        experience: entry.jobId.experience,
        jobDescription: entry.jobId.jobDescription,
        img: entry.jobId.img,
        savedAt: entry.savedAt,
      }));

    return res.status(200).json({
      totalSavedJobs: formattedSavedJobs.length,
      savedJobs: formattedSavedJobs,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getAppliedCompaniesData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const applications = await AppliedJob.find({ userId: req.user.id })
      .populate({
        path: "jobId",
        select: "companyName jobTitle location department workPlaceType",
      })
      .sort({ appliedAt: -1 });

    const formattedApplications = applications
      .filter((application) => application.jobId)
      .map((application) => ({
        applicationId: application._id,
        userId: application.userId,
        jobId: application.jobId._id,
        companyName: application.jobId.companyName,
        jobTitle: application.jobId.jobTitle,
        location: application.jobId.location,
        department: application.jobId.department,
        workPlaceType: application.jobId.workPlaceType,
        status: application.status,
        appliedAt: application.appliedAt,
      }));

    const uniqueCompanies = [
      ...new Set(
        formattedApplications.map((application) => application.companyName),
      ),
    ];

    return res.status(200).json({
      totalApplications: formattedApplications.length,
      uniqueCompaniesCount: uniqueCompanies.length,
      companies: uniqueCompanies,
      applications: formattedApplications,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
