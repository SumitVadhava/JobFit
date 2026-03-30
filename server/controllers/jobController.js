const Job = require("../models/jobs");
const AppliedJob = require("../models/appliedJobs");
const SavedJob = require("../models/savedJobs");
const Profile = require("../models/candidateProfile");
const Login = require("../models/login");
const GoogleLogin = require("../models/google_login");
const mongoose = require("mongoose");
const { ROLES } = require("../utils/roles");

const ADMIN_REVIEW_STATUSES = ["pending", "reviewed", "risky"];
const USER_MODELS = {
  LOGIN: "logins",
  GOOGLE_LOGIN: "google_logins",
};

const resolveUserModelFromAuth = async (authUser) => {
  const tokenUserModel = authUser?.userModel;
  if (
    tokenUserModel === USER_MODELS.LOGIN ||
    tokenUserModel === USER_MODELS.GOOGLE_LOGIN
  ) {
    return tokenUserModel;
  }

  if (!authUser?.id || !mongoose.Types.ObjectId.isValid(authUser.id)) {
    return null;
  }

  const [loginExists, googleLoginExists] = await Promise.all([
    Login.exists({ _id: authUser.id }),
    GoogleLogin.exists({ _id: authUser.id }),
  ]);

  if (loginExists) {
    return USER_MODELS.LOGIN;
  }

  if (googleLoginExists) {
    return USER_MODELS.GOOGLE_LOGIN;
  }

  return null;
};

const resolveAuthenticatedPrincipal = async (authUser) => {
  if (!authUser?.id || !mongoose.Types.ObjectId.isValid(authUser.id)) {
    return null;
  }

  const userModel = await resolveUserModelFromAuth(authUser);
  if (!userModel) {
    return null;
  }

  const user =
    userModel === USER_MODELS.LOGIN
      ? await Login.findById(authUser.id).select("_id role status").lean()
      : await GoogleLogin.findById(authUser.id).select("_id role").lean();

  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    role: String(user.role || "").toLowerCase(),
    userModel,
  };
};

const isOwnedByPrincipal = (ownerId, ownerModel, principal) => {
  if (!ownerId || !principal?.id || !principal?.userModel) {
    return false;
  }

  if (String(ownerId) !== String(principal.id)) {
    return false;
  }

  const normalizedOwnerModel = ownerModel || USER_MODELS.LOGIN;
  return normalizedOwnerModel === principal.userModel;
};

const buildRecruiterOwnershipFilter = (principal) => {
  const filters = [{ recruiterModel: principal.userModel }];

  if (principal.userModel === USER_MODELS.LOGIN) {
    filters.push({ recruiterModel: { $exists: false } });
  }

  return {
    recruiterId: principal.id,
    $or: filters,
  };
};

const attachCandidateUsers = async (applications) => {
  const loginUserIds = new Set();
  const googleUserIds = new Set();

  applications.forEach((application) => {
    if (!application?.userId) {
      return;
    }

    const userId = String(application.userId);
    if (application.userModel === USER_MODELS.LOGIN) {
      loginUserIds.add(userId);
      return;
    }

    if (application.userModel === USER_MODELS.GOOGLE_LOGIN) {
      googleUserIds.add(userId);
      return;
    }

    // Backward compatibility: older applications may not have userModel.
    loginUserIds.add(userId);
    googleUserIds.add(userId);
  });

  const [loginUsers, googleUsers] = await Promise.all([
    loginUserIds.size
      ? Login.find({ _id: { $in: [...loginUserIds] } })
          .select("userName email role status")
          .lean()
      : Promise.resolve([]),
    googleUserIds.size
      ? GoogleLogin.find({ _id: { $in: [...googleUserIds] } })
          .select("userName email role")
          .lean()
      : Promise.resolve([]),
  ]);

  const loginUserById = new Map(
    loginUsers.map((user) => [String(user._id), user]),
  );
  const googleUserById = new Map(
    googleUsers.map((user) => [String(user._id), user]),
  );

  return applications.map((application) => {
    if (!application?.userId) {
      return { ...application, candidateUser: null };
    }

    const userId = String(application.userId);
    let candidateUser = null;

    if (application.userModel === USER_MODELS.LOGIN) {
      candidateUser = loginUserById.get(userId) || null;
    } else if (application.userModel === USER_MODELS.GOOGLE_LOGIN) {
      candidateUser = googleUserById.get(userId) || null;
    } else {
      candidateUser =
        loginUserById.get(userId) || googleUserById.get(userId) || null;
    }

    return { ...application, candidateUser };
  });
};

exports.createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    } = req.body;

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newJob = new Job({
      recruiterId: principal.id,
      recruiterModel: principal.userModel,
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    });
    const savedJob = await newJob.save();
    res
      .status(201)
      .json({ message: "Job created successfully", job: savedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ message: "Jobs retrieved successfully", jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job retrieved successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = await AppliedJob.create({
      userId: principal.id,
      userModel: principal.userModel,
      jobId,
      status: "applied",
    });

    return res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You already applied to this job" });
    }

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findById(jobId).select("_id");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingSavedJob = await SavedJob.findOne({
      userId: principal.id,
      jobId,
      $or: [
        { userModel: principal.userModel },
        { userModel: { $exists: false } },
      ],
    }).select("_id");

    if (existingSavedJob) {
      return res.status(200).json({
        message: "Job already saved",
        saved: true,
      });
    }

    await SavedJob.create({
      userId: principal.id,
      userModel: principal.userModel,
      jobId,
    });

    return res.status(201).json({
      message: "Job saved successfully",
      saved: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const removed = await SavedJob.findOneAndDelete({
      userId: principal.id,
      jobId,
      $or: [
        { userModel: principal.userModel },
        { userModel: { $exists: false } },
      ],
    });

    if (!removed) {
      return res.status(404).json({
        message: "Saved job not found",
        saved: false,
      });
    }

    return res.status(200).json({
      message: "Job removed from saved jobs",
      saved: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getRecruiterOwnJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (String(principal.id) !== String(recruiterId)) {
      return res.status(403).json({
        message: "Forbidden: you can only access your own created jobs",
      });
    }

    const jobs = await Job.find(buildRecruiterOwnershipFilter(principal));

    return res.status(200).json({
      message: "Recruiter jobs retrieved successfully",
      jobs,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getCandidatesByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findById(jobId)
      .select("_id recruiterId recruiterModel jobTitle companyName")
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!isOwnedByPrincipal(job.recruiterId, job.recruiterModel, principal)) {
      return res.status(403).json({
        message: "Forbidden: you can only access candidates for your own jobs",
      });
    }

    const applications = await AppliedJob.find({ jobId: job._id })
      .sort({ appliedAt: -1 })
      .lean();

    const applicationsWithUsers = await attachCandidateUsers(applications);

    const candidateIds = applicationsWithUsers
      .map((application) => application.candidateUser?._id)
      .filter(Boolean);

    const profiles = await Profile.find({ user: { $in: candidateIds } })
      .select("user img atsScore skills experience resumeLink")
      .lean();

    const profileByUserId = new Map(
      profiles.map((profile) => [String(profile.user), profile]),
    );

    const candidates = applicationsWithUsers
      .filter((application) => application.candidateUser)
      .map((application) => {
        const profile = profileByUserId.get(
          String(application.candidateUser._id),
        );
        return {
          applicationId: application._id,
          candidateId: application.candidateUser._id,
          userName: application.candidateUser.userName,
          email: application.candidateUser.email,
          status: application.status,
          appliedAt: application.appliedAt,
          profile: profile
            ? {
                img: profile.img,
                atsScore: profile.atsScore,
                skills: profile.skills,
                experience: profile.experience,
                resumeLink: profile.resumeLink,
              }
            : null,
        };
      });

    return res.status(200).json({
      message: "Candidates retrieved successfully",
      job: {
        jobId: job._id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
      },
      totalCandidates: candidates.length,
      candidates,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getCandidatesForRecruiterJobs = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (String(principal.id) !== String(recruiterId)) {
      return res.status(403).json({
        message: "Forbidden: you can only access candidates for your own jobs",
      });
    }

    const recruiterJobs = await Job.find(
      buildRecruiterOwnershipFilter(principal),
    )
      .select("_id jobTitle companyName")
      .lean();

    if (recruiterJobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found for this recruiter",
        totalJobs: 0,
        totalCandidates: 0,
        candidates: [],
      });
    }

    const jobById = new Map(recruiterJobs.map((job) => [String(job._id), job]));
    const jobIds = recruiterJobs.map((job) => job._id);

    const applications = await AppliedJob.find({ jobId: { $in: jobIds } })
      .sort({ appliedAt: -1 })
      .lean();

    const applicationsWithUsers = await attachCandidateUsers(applications);

    const candidateIds = applicationsWithUsers
      .map((application) => application.candidateUser?._id)
      .filter(Boolean);

    const profiles = await Profile.find({ user: { $in: candidateIds } })
      .select("user img atsScore skills")
      .lean();

    const profileByUserId = new Map(
      profiles.map((profile) => [String(profile.user), profile]),
    );

    const candidates = applicationsWithUsers
      .filter((application) => application.candidateUser)
      .map((application) => {
        const job = jobById.get(String(application.jobId));
        const profile = profileByUserId.get(
          String(application.candidateUser._id),
        );

        return {
          applicationId: application._id,
          jobId: application.jobId,
          jobTitle: job?.jobTitle || null,
          companyName: job?.companyName || null,
          candidateId: application.candidateUser._id,
          userName: application.candidateUser.userName,
          email: application.candidateUser.email,
          status: application.status,
          appliedAt: application.appliedAt,
          profile: profile
            ? {
                img: profile.img,
                atsScore: profile.atsScore,
                skills: profile.skills,
              }
            : null,
        };
      });

    return res.status(200).json({
      message: "Candidates across recruiter jobs retrieved successfully",
      totalJobs: recruiterJobs.length,
      totalCandidates: candidates.length,
      candidates,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getUniqueCandidatesCountForRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter id" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (String(principal.id) !== String(recruiterId)) {
      return res.status(403).json({
        message: "Forbidden: you can only access candidates for your own jobs",
      });
    }

    const recruiterJobs = await Job.find(
      buildRecruiterOwnershipFilter(principal),
    )
      .select("_id")
      .lean();

    if (recruiterJobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found for this recruiter",
        totalJobs: 0,
        uniqueCandidates: 0,
      });
    }

    const jobIds = recruiterJobs.map((job) => job._id);

    const uniqueCandidateAggregate = await AppliedJob.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
        },
      },
      {
        $project: {
          userId: 1,
          userModel: {
            $ifNull: ["$userModel", USER_MODELS.LOGIN],
          },
        },
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            userModel: "$userModel",
          },
        },
      },
      {
        $count: "total",
      },
    ]);

    const uniqueCandidates = uniqueCandidateAggregate[0]?.total || 0;

    return res.status(200).json({
      message: "Unique candidates count retrieved successfully",
      recruiterId,
      totalJobs: recruiterJobs.length,
      uniqueCandidates,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const existingJob = await Job.findById(req.params.id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !isOwnedByPrincipal(
        existingJob.recruiterId,
        existingJob.recruiterModel,
        principal,
      )
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only update your own jobs" });
    }

    const {
      jobTitle,
      department,
      openings,
      experience,
      responsibilities,
      qualifications,
      companyName,
      location,
      workPlaceType,
      jobDescription,
      img,
      bookmarked,
    } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        jobTitle,
        department,
        openings,
        experience,
        openings,
        responsibilities,
        qualifications,
        companyName,
        location,
        workPlaceType,
        jobDescription,
        img,
        bookmarked,
      },
      { new: true, runValidators: true },
    );
    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateJobAdminReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReview } = req.body;

    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    if (!ADMIN_REVIEW_STATUSES.includes(adminReview)) {
      return res.status(400).json({
        message: `Invalid adminReview status. Allowed values: ${ADMIN_REVIEW_STATUSES.join(", ")}`,
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { adminReview },
      { new: true, runValidators: true },
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job admin review status updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const principal = await resolveAuthenticatedPrincipal(req.user);
    if (!principal) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const userRole = principal.role;
    if (
      userRole !== ROLES.ADMIN &&
      !isOwnedByPrincipal(job.recruiterId, job.recruiterModel, principal)
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only delete your own jobs" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
