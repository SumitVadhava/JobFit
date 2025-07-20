const mongoose = require('mongoose');
const { type } = require('os');

const userDashboardSchema = new mongoose.Schema({
    latestScore: {
        type: Number,
        required: true,
        default: 0,
    },
    bestScore: {
        type: Number,
        required: true,
        default: 0,
    },
    totalUploads: {
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

module.exports = mongoose.model("userDashboard", userDashboardSchema);