const Profile = require("../models/candidateProfile");
const Login = require("../models/login");
const GoogleLogin = require("../models/google_login");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const fs = require("fs");

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

const buildProfileFilter = (userId, userModel) => ({
  user: userId,
  $or: [{ userModel }, { userModel: { $exists: false } }],
});

const handleError = (res, error, defaultMessage = "Server error") => {
  console.error("Profile Controller Error:", error);
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: error.message, errors: error.errors });
  }
  res.status(500).json({ message: defaultMessage, error: error.message });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const profile = await Profile.findOne(
      buildProfileFilter(userId, userModel),
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res
      .status(200)
      .json({ message: "Profile retrieved successfully", profile });
  } catch (error) {
    handleError(res, error, "Error retrieving profile");
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const profile = await Profile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile retrieved successfully", profile });
  } catch (error) {
    handleError(res, error, "Error retrieving profile");
  }
};

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    // Parse body fields, handling both JSON and multipart
    let body = req.body;
    if (req.file) {
      // For multipart, fields are strings, parse JSON ones
      body = {};
      Object.keys(req.body).forEach(key => {
        try {
          body[key] = JSON.parse(req.body[key]);
        } catch {
          body[key] = req.body[key];
        }
      });
    }

    const {
      img,
      description,
      experience,
      education,
      skills,
      softSkills,
      name,
      email,
    } = body;

    // Handle profile photo upload
    let profilePhotoUrl = img; // Use provided img if no file uploaded
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_photos',
              public_id: `user_${userId}_${Date.now()}`,
              transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePhotoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload profile photo' });
      }
    }

    const profile = await Profile.create({
      user: userId,
      userModel,
      img: profilePhotoUrl || null,
      description: description || null,
      experience: experience || "0-2 years",
      atsScore: 0,
      education: education || [],
      skills: skills || [],
      softSkills: softSkills || [],
      name: name || null,
      email: email || null,
    });

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    handleError(res, error, "Error creating profile");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    // Parse body fields, handling both JSON and multipart
    let body = req.body;
    if (req.file) {
      // For multipart, fields are strings, parse JSON ones
      body = {};
      Object.keys(req.body).forEach(key => {
        try {
          body[key] = JSON.parse(req.body[key]);
        } catch {
          body[key] = req.body[key];
        }
      });
    }

    const {
      img,
      description,
      experience,
      education,
      skills,
      softSkills,
      name,
      atsScore,
      userName,
    } = body;

    // Handle profile photo upload
    let profilePhotoUrl = img; // Use provided img if no file uploaded
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_photos',
              public_id: `user_${userId}_${Date.now()}`,
              transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePhotoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload profile photo' });
      }
    }

    // Filter out null, undefined, or empty strings so we only perform a partial update
    const updates = {};
    if (profilePhotoUrl) updates.img = profilePhotoUrl;
    if (description) updates.description = description;
    if (experience) updates.experience = experience;
    if (education && Array.isArray(education)) updates.education = education;
    if (skills && Array.isArray(skills)) updates.skills = skills;
    if (softSkills && Array.isArray(softSkills))
      updates.softSkills = softSkills;
    if (name) updates.name = name;
    if (userName) updates.userName = userName;
    if (atsScore !== undefined) updates.atsScore = atsScore;

    const updatedProfile = await Profile.findOneAndUpdate(
      buildProfileFilter(userId, userModel),
      { $set: { ...updates, userModel } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    handleError(res, error, "Error updating profile");
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const deleted = await Profile.findOneAndDelete(
      buildProfileFilter(userId, userModel),
    );

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting profile");
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userModel = await resolveUserModelFromAuth(req.user);
    if (!userModel) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    if (!req.file.buffer) {
      return res.status(400).json({ message: "File buffer not available" });
    }

    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables missing:", {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
      });
      return res.status(500).json({ message: "Cloudinary configuration incomplete - check environment variables" });
    }

    console.log("Uploading to Cloudinary:", {
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    });

    // Upload buffer directly to Cloudinary
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      resource_type: "raw",
      folder: "candidate_resumes",
      format: "pdf",
      public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`,
      timeout: 60000, // 60 seconds timeout
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    const updatedProfile = await Profile.findOneAndUpdate(
      buildProfileFilter(userId, userModel),
      { resumeLink: result.secure_url, userModel },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeLink: result.secure_url,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Resume upload error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      http_code: error.http_code,
      name: error.name
    });

    // Provide specific error messages based on error type
    if (error.message && error.message.includes('api_key')) {
      return res.status(500).json({ message: "Cloudinary API key not configured - check environment variables" });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Profile validation failed", error: error.message });
    }

    if (error.http_code) {
      // Cloudinary specific errors
      if (error.http_code === 401) {
        return res.status(500).json({ message: "Cloudinary authentication failed - check API credentials" });
      }
      if (error.http_code === 403) {
        return res.status(500).json({ message: "Cloudinary access forbidden - check permissions" });
      }
      if (error.http_code === 413) {
        return res.status(400).json({ message: "File too large for Cloudinary" });
      }
      return res.status(500).json({ message: `Cloudinary upload failed: ${error.message}` });
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({ message: "Cannot connect to Cloudinary - check network connection" });
    }

    handleError(res, error, "Error uploading resume");
  }
};
