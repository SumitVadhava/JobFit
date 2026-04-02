const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminJobsController = require("../controllers/adminJobsController");
const { adminAuth, validateUserUpdate, validateJobStatusUpdate } = require("../middlewares/adminMiddleware");
const { validateIds } = require("../middlewares/commonMiddleware");

// All admin routes are protected and require the ADMIN role
router.use(adminAuth);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get("/dashboard", adminController.getDashboardData);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (candidates and recruiters)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 */
router.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update user name and email (updates both user and profile)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch("/users/:id", validateIds(["id"]), validateUserUpdate, adminController.updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user and their profile
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/users/:id", validateIds(["id"]), adminController.deleteUser);

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs with details
 *     tags: [Admin-Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs retrieved successfully
 */
router.get("/jobs", adminJobsController.getAllJobs);

/**
 * @swagger
 * /api/admin/jobs/status/{id}:
 *   patch:
 *     summary: Update job status
 *     tags: [Admin-Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, verified, risky]
 *     responses:
 *       200:
 *         description: Job status updated successfully
 */
router.patch("/jobs/status/:id", validateIds(["id"]), validateJobStatusUpdate, adminJobsController.updateJobStatus);

/**
 * @swagger
 * /api/admin/companies:
 *   get:
 *     summary: Get company details based on jobs (picture, name, total openings)
 *     tags: [Admin-Jobs]
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 */
router.get("/companies", adminJobsController.getCompaniesData);

module.exports = router;
