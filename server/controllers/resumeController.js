const Resume = require('../models/resume');

exports.uploadResume = async (req, res) => {
    try {
        const {resumeName, resumeDate, resumeFiles, atsScore } = req.body;
        const newResume = new Resume({
            resumeName,
            resumeDate,
            resumeFiles,
            atsScore,
            // userId: req.body.userId
        });
        const savedResume = await newResume.save();
        res.status(201).json(savedResume);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getResumesByUserId = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.params.userId });
        if (!resumes || resumes.length === 0) {
            return res.status(404).json({ message: 'No resumes found for this user' });
        }
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};