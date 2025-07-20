const mongoose = require('mongoose');
const { type } = require('os');

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    responsibilities: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    workPlaceType: {
        type: String,
        enum: ['remote', 'onsite', 'hybrid'],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    img:{
        type: String,
        required: false,
        default: null
    },
    bookmarked: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("jobs", jobSchema);