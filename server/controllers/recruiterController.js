const Job = require("../models/jobs");
const Application = require("../models/applications");
const RecruiterProfile = require("../models/recruiterProfile");
const mongoose = require("mongoose");

/**
 * Get recruiter dashboard analytics (Formerly getRecruiterDashboard)
 */
exports.getRecruiterDashboard = async (req, res) => {
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
          recentApplications: [],
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

    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("candidateId", "userName email picture")
      .populate("jobId", "jobTitle");

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
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch dashboard analytics." });
  }
};

/**
 * Get recruiter profile
 */
exports.getRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await RecruiterProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: true, message: "Recruiter profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Recruiter profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch profile." });
  }
};

/**
 * Get recruiter profile by ID
 */
exports.getRecruiterProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ error: true, message: "Invalid profile ID" });
    }

    const profile = await RecruiterProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: true, message: "Recruiter profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Recruiter profile retrieved successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile By ID Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch profile." });
  }
};

/**
 * Create recruiter profile
 */
exports.createRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, userName, img, company, position, description, location, website, linkedIn, teamSize } = req.body;

    // Check if profile already exists
    const existingProfile = await RecruiterProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ error: true, message: "Recruiter profile already exists. Use PUT to update." });
    }

    const newProfile = new RecruiterProfile({
      user: userId,
      email: email || null,
      userName: userName || null,
      img: img || null,
      company: company || null,
      position: position || null,
      description: description || null,
      location: location || null,
      website: website || null,
      linkedIn: linkedIn || null,
      teamSize: teamSize || 0,
    });

    await newProfile.save();

    res.status(201).json({
      error: false,
      message: "Recruiter profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to create profile." });
  }
};

/**
 * Update recruiter profile
 */
exports.updateRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, userName, img, company, position, description, location, website, linkedIn, teamSize } = req.body;

    if (email !== undefined) {
      return res.status(400).json({ error: true, message: "Email changes are not allowed through this endpoint." });
    }

    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (img !== undefined) updateData.img = img;
    if (img !== undefined) updateData.img = img;
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (linkedIn !== undefined) updateData.linkedIn = linkedIn;
    if (teamSize !== undefined) updateData.teamSize = teamSize;

    const updatedProfile = await RecruiterProfile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: true, message: "Recruiter profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Recruiter profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to update profile." });
  }
};

/**
 * Patch recruiter profile (partial update)
 */
exports.patchRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };

    if (updateData.email !== undefined) {
      return res.status(400).json({ error: true, message: "Email changes are not allowed through this endpoint." });
    }

    // Only allow specific fields
    const allowedFields = ["userName", "img", "company", "position", "description", "location", "website", "linkedIn", "teamSize"];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedProfile = await RecruiterProfile.findOneAndUpdate(
      { user: userId },
      filteredData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: true, message: "Recruiter profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Recruiter profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Patch Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to update profile." });
  }
};

/**
 * Delete recruiter profile
 */
exports.deleteRecruiterProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await RecruiterProfile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      return res.status(404).json({ error: true, message: "Recruiter profile not found." });
    }

    res.status(200).json({
      error: false,
      message: "Recruiter profile deleted successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);
    res.status(500).json({ error: true, message: "Failed to delete profile." });
  }
};
