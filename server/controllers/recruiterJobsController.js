const Job = require("../models/jobs");
const Application = require("../models/applications");
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
 * Post a new job
 */
exports.postJob = async (req, res) => {
  try {
    const openingsParsed = parseInt(req.body.openings, 10);
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

/**
 * Delete a job (Only if no one has applied)
 */
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validation (Job existence, Ownership, Applicant check) is now handled by validateJobDeletion middleware

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      error: false,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ error: true, message: "Failed to delete job." });
  }
};
