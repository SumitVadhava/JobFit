const Job = require("../models/jobs");
const Application = require("../models/applications");
const RecruiterProfile = require("../models/recruiterProfile");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

/**
 * Helper to upload a buffer to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder = "job_images") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Get recruiter dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const totalJobs = await Job.countDocuments({ recruiterId });
    const activeJobs = await Job.countDocuments({ recruiterId, openings: { $gt: 0 } });
    
    const myJobIds = await Job.find({ recruiterId }).distinct("_id");
    const totalApplicants = await Application.countDocuments({ jobId: { $in: myJobIds } });
    const hiredCount = await Application.countDocuments({ jobId: { $in: myJobIds }, status: "hired" });

    res.status(200).json({
      error: false,
      message: "Dashboard stats retrieved successfully.",
      data: {
        totalJobs,
        activeJobs,
        totalApplicants,
        hiredCount,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch dashboard stats." });
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

    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (userName !== undefined) updateData.userName = userName;
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

    // Only allow specific fields
    const allowedFields = ["email", "userName", "img", "company", "position", "description", "location", "website", "linkedIn", "teamSize"];
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

/**
 * Post a new job
 */
exports.postJob = async (req, res) => {
  try {
    const openingsParsed = parseInt(req.body.openings, 10);
    if (isNaN(openingsParsed) || openingsParsed < 0) {
      return res.status(400).json({ error: true, message: "Valid number of openings is required." });
    }
    const { jobTitle, companyName, location, jobDescription, department, experience, responsibilities, qualifications, workPlaceType, img } = req.body;

    let imageUrl = img || null;

    // 1. If a file is uploaded via multipart/form-data
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ error: true, message: "Failed to upload image to cloud." });
      }
    } 
    // 2. If no file, check if 'img' is a valid URL string (handled by imageUrl = img above)
    // No additional logic needed as imageUrl is already set to req.body.img

    const parseToArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [val];
      }
    };

    const newJob = new Job({
      recruiterId: req.user.id,
      jobTitle,
      companyName,
      location,
      openings: openingsParsed,
      jobDescription,
      department,
      experience,
      responsibilities: parseToArray(responsibilities),
      qualifications: parseToArray(qualifications),
      workPlaceType,
      img: imageUrl,
    });

    await newJob.save();

    res.status(201).json({
      error: false,
      message: "Job posted successfully.",
      data: newJob,
    });
  } catch (error) {
    console.error("Post Job Error:", error);
    res.status(500).json({ error: true, message: "Failed to post job." });
  }
};

/**
 * Get jobs posted by the recruiter (Active)
 */
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id, openings: { $gt: 0 } }).sort({ createdAt: -1 });

    res.status(200).json({
      error: false,
      message: "Jobs retrieved successfully.",
      data: jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch jobs." });
  }
};

/**
 * Get job history (Completed jobs with 0 openings)
 */
exports.getJobHistory = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id, openings: 0 }).sort({ updatedAt: -1 });

    res.status(200).json({
      error: false,
      message: "Job history retrieved successfully.",
      data: jobs,
    });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch job history." });
  }
};

/**
 * Get applicants for recruiter's jobs
 */
exports.getApplicants = async (req, res) => {
  try {
    const { jobId } = req.query;
    const filter = {};

    const myJobIds = await Job.find({ recruiterId: req.user.id }).distinct("_id");
    
    if (jobId) {
       if (!myJobIds.map(id => id.toString()).includes(jobId)) {
           return res.status(403).json({ error: true, message: "Unauthorized access to this job's applicants." });
       }
       filter.jobId = jobId;
    } else {
       filter.jobId = { $in: myJobIds };
    }

    const applicants = await Application.find(filter)
      .populate("candidateId", "userName email picture")
      .populate("jobId", "jobTitle companyName")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      error: false,
      message: "Applicants retrieved successfully.",
      data: applicants,
    });
  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({ error: true, message: "Failed to fetch applicants." });
  }
};

/**
 * Update application status (Shortlist, Hire, Reject)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: true, message: "Application not found." });
    }

    const job = await Job.findById(application.jobId);
    if (String(job.recruiterId) !== String(req.user.id)) {
      return res.status(403).json({ error: true, message: "Unauthorized to update this application." });
    }

    const oldStatus = application.status;
    application.status = status;

    // Special Logic: If status becomes "hired", decrement job openings
    if (status === "hired" && oldStatus !== "hired") {
      if (job.openings > 0) {
        job.openings -= 1;
        job.updatedAt = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        await job.save();
      } else {
        return res.status(400).json({ error: true, message: "No openings available for this job." });
      }
      application.hiredAt = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    }

    await application.save();

    res.status(200).json({
      error: false,
      message: `Application status updated to ${status}.`,
      data: { application, openingsRemaining: job.openings },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: true, message: "Failed to update application status." });
  }
};
