const express = require("express");
const router = express.Router();
const userDashboardController = require("../controllers/userDashboardController");
const userDashboard = require("../middlewares/userDashboardMid");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLES } = require("../utils/roles");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: user routes (requires JWT)
 */

/**
 * @swagger
 * /api/user/userDashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard statistics and overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/userDashboard", userDashboardController.getUserDashboardData);

/**
 * @swagger
 * /api/user/userDashboard:
 *   patch:
 *     summary: Update user dashboard fields dynamically
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: User dashboard updated
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/userDashboard",
  userDashboard,
  userDashboardController.updateUserDashboardData,
);

/**
 * @swagger
 * /api/user/resumeBuilder:
 *   get:
 *     summary: Get resume builder data for the current user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume builder data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/resumeBuilder", userDashboardController.getResumeBuilderData);

/**
 * @swagger
 * /api/user/job:
 *   get:
 *     summary: Get job listings relevant to the current user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended/available jobs
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
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 */
router.get("/job", userDashboardController.getJobData);

/**
 * @swagger
 * /api/user/savedJobs:
 *   get:
 *     summary: Get all jobs saved by the current user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedJobsListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - candidate/user role required
 */
router.get(
  "/savedJobs",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  userDashboardController.getSavedJobsData,
);

/**
 * @swagger
 * /api/user/applied-companies:
 *   get:
 *     summary: Get applied companies and application details for the current user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies and job applications for the current user
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/applied-companies",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  userDashboardController.getAppliedCompaniesData,
);

/**
 * @swagger
 * /api/user/notifications:
 *   get:
 *     summary: Get application outcome notifications for the current user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/notifications",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  userDashboardController.getMyNotifications,
);

/**
 * @swagger
 * /api/user/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification document ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Invalid notification id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.patch(
  "/notifications/:notificationId/read",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  userDashboardController.markNotificationAsRead,
);

module.exports = router;
