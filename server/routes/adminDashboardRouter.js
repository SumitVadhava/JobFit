const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard routes (requires JWT + admin role)
 */

// ─────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard overview stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Operation successful"
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard', adminController.getDashboardData);

// ─────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users (candidates & users)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64abc123def456"
 *                       userName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       role:
 *                         type: string
 *                         example: "candidate"
 *                       status:
 *                         type: string
 *                         example: "active"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/users', adminController.getUsersData);

/**
 * @swagger
 * /api/admin/users:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64abc123def456"
 *                 description: Valid MongoDB ObjectId of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Operation successful"
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: userId is required or invalid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/users', adminController.deleteUser);

// ─────────────────────────────────────────────────────────
// RECRUITERS
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/recruiters:
 *   get:
 *     summary: Get all recruiters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all recruiters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Operation successful"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64abc123def456"
 *                       userName:
 *                         type: string
 *                         example: "TechCorp HR"
 *                       email:
 *                         type: string
 *                         example: "hr@techcorp.com"
 *                       role:
 *                         type: string
 *                         example: "recruiter"
 *                       status:
 *                         type: string
 *                         example: "active"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/recruiters', adminController.getRecruitersData);

// ─────────────────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs (admin view)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64abc123def456"
 *                       recruiterId:
 *                         type: string
 *                         example: "687c5aac240f88425de5edb1"
 *                       jobTitle:
 *                         type: string
 *                         example: "Software Engineer"
 *                       department:
 *                         type: string
 *                         example: "Engineering"
 *                       openings:
 *                         type: number
 *                         example: 3
 *                       experience:
 *                         type: string
 *                         example: "1-2 years"
 *                       companyName:
 *                         type: string
 *                         example: "TechCorp"
 *                       location:
 *                         type: string
 *                         example: "Bangalore, India"
 *                       workPlaceType:
 *                         type: string
 *                         enum: [remote, onsite, hybrid]
 *                         example: "remote"
 *                       adminReview:
 *                         type: string
 *                         enum: [pending, reviewed, risky]
 *                         example: "pending"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/jobs', adminController.getJobsData);

// ─────────────────────────────────────────────────────────
// COMPANIES
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/companies:
 *   get:
 *     summary: Get list of all distinct company names
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of distinct company names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Operation successful"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["TechCorp", "InnoSoft", "DataWave"]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get('/companies', adminController.getCompaniesData);

// ─────────────────────────────────────────────────────────
// CANDIDATE PROFILE CRUD
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/candidates/profile:
 *   post:
 *     summary: Create a candidate profile (admin)
 *     description: Creates a new profile for a user. Pass the user's MongoDB ObjectId as `userId` in the request body.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64abc123def456"
 *                 description: Valid MongoDB ObjectId of the user
 *               img:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               description:
 *                 type: string
 *                 example: "Experienced software engineer."
 *               atsScore:
 *                 type: number
 *                 example: 85
 *               experience:
 *                 type: string
 *                 example: "3-5 years"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     skillName:
 *                       type: string
 *                       example: "JavaScript"
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degree:
 *                       type: string
 *                       example: "B.Tech"
 *                     university:
 *                       type: string
 *                       example: "MIT"
 *                     yearOfPassing:
 *                       type: number
 *                       example: 2022
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Profile created"
 *                 data:
 *                   type: object
 *       400:
 *         description: Profile already exists or invalid/missing userId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.post('/candidates/profile', adminController.createCandidateProfile);

/**
 * @swagger
 * /api/admin/candidates/{userId}/profile:
 *   get:
 *     summary: Get a candidate's profile by userId
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *           example: "64abc123def456"
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Operation successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     atsScore:
 *                       type: number
 *                     experience:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: object
 *                     education:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid userId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a candidate's profile by userId
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *           example: "64abc123def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               atsScore:
 *                 type: number
 *                 example: 95
 *               experience:
 *                 type: string
 *                 example: "5+ years"
 *               description:
 *                 type: string
 *                 example: "Updated bio"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     skillName:
 *                       type: string
 *                       example: "React"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Profile updated"
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid userId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a candidate's profile by userId
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *           example: "64abc123def456"
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Profile deleted"
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid userId format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/candidates/:userId/profile', adminController.getCandidateProfile);
router.put('/candidates/:userId/profile', adminController.updateCandidateProfile);
router.delete('/candidates/:userId/profile', adminController.deleteCandidateProfile);

module.exports = router;