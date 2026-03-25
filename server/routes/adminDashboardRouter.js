const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');
const adminDashboard = require('../middlewares/adminDashboardMid');

router.get('/dashboard', adminDashboard, adminController.getDashboardData);
router.get('/users', adminDashboard, adminController.getUsersData);
router.delete('/users', adminDashboard, adminController.getUsersData);
router.get('/recruiters', adminDashboard, adminController.getUsersData);
router.get('/jobs', adminDashboard, adminController.getJobsData);
router.get('/companies', adminDashboard, adminController.getCompaniesData);

module.exports = router;

