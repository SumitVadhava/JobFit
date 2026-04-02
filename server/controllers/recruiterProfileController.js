const RecruiterProfile = require('../models/recruiterProfile');
const Job = require('../models/jobs');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const handleError = (res, error, msg = 'Server error') => {
  console.error('[RecruiterProfile]', error);
  if (error.name === 'ValidationError')
    return res.status(400).json({ message: error.message, errors: error.errors });
  res.status(500).json({ message: msg, error: error.message });
};

/** Upload image buffer to Cloudinary and return the secure URL */
const uploadImageToCloudinary = async (buffer, userId) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'recruiter_photos',
        public_id: `recruiter_${userId}_${Date.now()}`,
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto' },
        ],
      },
      (err, res) => (err ? reject(err) : resolve(res)),
    );
    stream.end(buffer);
  });
  return result.secure_url;
};

/** Count jobs posted by a recruiter from the jobs collection */
const getJobsPostedCount = async (userId) => {
  return await Job.countDocuments({ recruiterId: userId });
};

/**
 * Build an updates object from the parsed body.
 * Only model fields that are explicitly provided are included.
 * Model fields: email, userName, img, company, position,
 *               description, location, website, linkedIn, candidatesHired
 * Note: jobsPosted is always auto-synced — never taken from the body.
 */
const buildUpdates = (body) => {
  const {
    email, userName,
    company, position,
    description,
    location, website, linkedIn,
    candidatesHired,
    teamSize
  } = body;

  const updates = {};
  if (email !== undefined) updates.email = email;
  if (userName !== undefined) updates.userName = userName;
  if (company !== undefined) updates.company = company;
  if (position !== undefined) updates.position = position;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (website !== undefined) updates.website = website;
  if (linkedIn !== undefined) updates.linkedIn = linkedIn;
  if (candidatesHired !== undefined) updates.candidatesHired = Number(candidatesHired);
  if (teamSize !== undefined) updates.teamSize = Number(teamSize);
  return updates;
};

// ─────────────────────────────────────────────
// POST /api/recruiter-profile
// Pre-checked by validateCreateRecruiterProfile middleware (409, field validation)
// ─────────────────────────────────────────────
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // req.parsedBody is set by the middleware
    const body = req.parsedBody || req.body;
    const updates = buildUpdates(body);

    // Handle profile photo if uploaded
    if (req.file) {
      try {
        updates.img = await uploadImageToCloudinary(req.file.buffer, userId);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload profile photo' });
      }
    } else if (body.img !== undefined) {
      updates.img = body.img;
    }

    // Always sync live jobsPosted count
    updates.jobsPosted = await getJobsPostedCount(userId);

    const profile = await RecruiterProfile.create({ user: userId, ...updates });

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    handleError(res, err, 'Error creating recruiter profile');
  }
};

// ─────────────────────────────────────────────
// GET /api/recruiter-profile  (own profile)
// ─────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await RecruiterProfile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Sync jobsPosted from live job data
    const liveJobsPosted = await getJobsPostedCount(userId);
    if (profile.jobsPosted !== liveJobsPosted) {
      profile = await RecruiterProfile.findOneAndUpdate(
        { user: userId },
        { $set: { jobsPosted: liveJobsPosted } },
        { new: true },
      );
    }

    res.status(200).json({ message: 'Profile retrieved successfully', profile });
  } catch (err) {
    handleError(res, err, 'Error retrieving recruiter profile');
  }
};

// ─────────────────────────────────────────────
// GET /api/recruiter-profile/:id  (public)
// ─────────────────────────────────────────────
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid user ID' });

    const profile = await RecruiterProfile.findOne({ user: id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile retrieved successfully', profile });
  } catch (err) {
    handleError(res, err, 'Error retrieving recruiter profile');
  }
};

// ─────────────────────────────────────────────
// PUT /api/recruiter-profile
// Pre-checked by validateUpdateRecruiterProfile middleware (404, field validation)
// ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // req.parsedBody is set by the middleware
    const body = req.parsedBody || req.body;
    const updates = buildUpdates(body);

    // Handle profile photo if uploaded
    if (req.file) {
      try {
        updates.img = await uploadImageToCloudinary(req.file.buffer, userId);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload profile photo' });
      }
    } else if (body.img !== undefined) {
      updates.img = body.img;
    }

    // Always sync live jobsPosted count
    updates.jobsPosted = await getJobsPostedCount(userId);

    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    handleError(res, err, 'Error updating recruiter profile');
  }
};

// ─────────────────────────────────────────────
// DELETE /api/recruiter-profile
// ─────────────────────────────────────────────
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const deleted = await RecruiterProfile.findOneAndDelete({ user: userId });
    if (!deleted) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    handleError(res, err, 'Error deleting recruiter profile');
  }
};

// ─────────────────────────────────────────────
// GET /api/recruiter-profile/stats
// ─────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await RecruiterProfile.findOne({ user: userId }).select('candidatesHired jobsPosted');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const jobsPosted = await getJobsPostedCount(userId);

    res.status(200).json({
      message: 'Stats retrieved successfully',
      stats: {
        jobsPosted,
        candidatesHired: profile.candidatesHired ?? 0,
      },
    });
  } catch (err) {
    handleError(res, err, 'Error retrieving recruiter stats');
  }
};
