const UserDashboard = require('../models/userDashboard');

exports.getUserDashboardData = async (req, res) => {
    try {
        const dashboardData = await UserDashboard.findOne({});
        if (!dashboardData) {
            return res.status(404).json({ message: 'User dashboard data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getResumeBuilderData = async (req, res) => {
    try {
        const dashboardData = await UserDashboard.findOne({}, { latestScore: 1, bestScore: 1, totalUploads: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Resume builder data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getJobData = async (req, res) => {
    try {
        const dashboardData = await UserDashboard.findOne({}, { jobPostsByIndustry: 1, userActivityByTime: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Job data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSavedJobsData = async (req, res) => {
    try {
        const dashboardData = await UserDashboard.findOne({}, { jobPostsByIndustry: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Saved jobs data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};