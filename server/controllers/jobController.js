const Job = require('../models/jobs');

exports.createJob = async (req, res) => {
    try {
        const { jobTitle, department, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription, img, bookmarked } = req.body;
        const newJob = new Job({
            jobTitle,
            department,
            responsibilities,
            qualifications,
            companyName,
            location,
            workPlaceType,
            jobDescription,
            img,
            bookmarked
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { jobTitle, department, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription, img, bookmarked } = req.body;
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { jobTitle, department, responsibilities, qualifications, companyName, location, workPlaceType, jobDescription, img, bookmarked },
            { new: true, runValidators: true }
        );
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};