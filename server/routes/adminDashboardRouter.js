const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminDashboardController");

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
 *       404:
 *         description: Dashboard data not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", adminController.getDashboardData);

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
router.get("/jobs", adminController.getJobsData);

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
router.get("/companies", adminController.getCompaniesData);

module.exports = router;
