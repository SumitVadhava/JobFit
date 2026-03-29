const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');

/**
 * @swagger
 * tags:
 *   name: Admin - Recruiters
 *   description: Admin CRUD operations for recruiter accounts
 */

// ─────────────────────────────────────────────────────────
// RECRUITER ACCOUNT CRUD
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/recruiters:
 *   get:
 *     summary: Get all recruiter accounts
 *     tags: [Admin - Recruiters]
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
 *   post:
 *     summary: Create a new recruiter account
 *     tags: [Admin - Recruiters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "HR Manager"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "hr@techcorp.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Secret@123"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Recruiter account created successfully
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
 *                   example: "recruiter account created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: "recruiter"
 *                     status:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin role required
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a recruiter account by userId
 *     tags: [Admin - Recruiters]
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
 *                 description: Valid MongoDB ObjectId of the recruiter to delete
 *     responses:
 *       200:
 *         description: Recruiter deleted successfully
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
 *                   example: "recruiter deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: userId missing or invalid format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – user is not a recruiter or admin role required
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.get('/', adminController.getRecruitersData);
router.post('/', adminController.createRecruiter);
router.delete('/', adminController.deleteRecruiter);

/**
 * @swagger
 * /api/admin/recruiters/{userId}:
 *   put:
 *     summary: Update a recruiter account by userId
 *     tags: [Admin - Recruiters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the recruiter
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
 *               userName:
 *                 type: string
 *                 example: "Updated HR Name"
 *               email:
 *                 type: string
 *                 example: "updated@techcorp.com"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Recruiter updated successfully
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
 *                   example: "recruiter updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid userId format or no valid fields to update
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – user is not a recruiter or admin role required
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', adminController.updateRecruiter);

module.exports = router;
