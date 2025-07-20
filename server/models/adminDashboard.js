const mongoose = require('mongoose');
const { type } = require('os');

const adminDashboardSchema = new mongoose.Schema({
    totalSeekers: {
        type: Number,
        required: true,
        default: 0,
    },
    totalRecruiter: {
        type: Number,
        required: true,
        default: 0,
    },
    totalJobs: {
        type: Number,
        required: true,
        default: 0,
    },
    resumeEvaluted: {
        type: Number,
        required: true,
        default: 0,
    },
    userActivityByTime:{
        type:Number,
        required: true,
        default: 15,
    },
    jobPostsByIndustry: {
        
        type: Number,
        required: false,
        default: 8,
    }
});

module.exports = mongoose.model("adminDashboard", adminDashboardSchema);