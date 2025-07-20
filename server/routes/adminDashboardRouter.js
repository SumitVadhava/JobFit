const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');
const adminDashboard = require('../middleware/adminDashboard');

router.get('/dashboard', adminDashboard, adminDashboardController.getDashboardData);
router.get('/users', adminDashboard, adminDashboardController.getUsersData);
router.delete('/users', adminDashboard, adminDashboardController.getUsersData);
router.get('/recruiters', adminDashboard, adminDashboardController.getUsersData);
router.get('/jobs', adminDashboard, adminDashboardController.getJobsData);
router.get('/companies', adminDashboard, adminDashboardController.getCompaniesData);

module.exports = router;

