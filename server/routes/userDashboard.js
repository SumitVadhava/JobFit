const express = require('express');
const router = express.Router();
const userDashboardController = require('../controllers/userDashboardController');
const userDashboard = require('../middleware/userDashboard');

//navbar routes

router.get('/userDashboard', userDashboard, userDashboardController.getUserDashboardData);
router.get('/resumeBuilder', userDashboard, userDashboardController.getResumeBuilderData);
router.get('/job', userDashboard, userDashboardController.getJobData);
router.get('/savedJobs', userDashboard, userDashboardController.getSavedJobsData);

module.exports = router;

