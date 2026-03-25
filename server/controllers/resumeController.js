const Resume = require("../models/resume");

exports.uploadResume = async (req, res) => {
  try {
    const { resumeName, resumeDate, resumeFiles, atsScore } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newResume = new Resume({
      userId,
      resumeName,
      resumeDate,
      resumeFiles,
      atsScore,
    });
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getResumesByUserId = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const resumes = await Resume.find({ userId });
    if (!resumes || resumes.length === 0) {
      return res
        .status(404)
        .json({ message: "No resumes found for this user" });
    }
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
