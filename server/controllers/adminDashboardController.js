const AdminDashboard = require('../models/adminDashboard');

exports.getDashboardData = async (req, res) => {
    try {
        const dashboardData = await AdminDashboard.findOne({});
        if (!dashboardData) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUsersData = async (req, res) => {
    try {
        const dashboardData = await AdminDashboard.findOne({}, { totalSeekers: 1, totalRecruiter: 1, userActivityByTime: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Users data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getJobsData = async (req, res) => {
    try {
        const dashboardData = await AdminDashboard.findOne({}, { totalJobs: 1, jobPostsByIndustry: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Jobs data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getCompaniesData = async (req, res) => {
    try {
        const dashboardData = await AdminDashboard.findOne({}, { totalRecruiter: 1, jobPostsByIndustry: 1, _id: 0 });
        if (!dashboardData) {
            return res.status(404).json({ message: 'Companies data not found' });
        }
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};