const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');

/**
 * @swagger
 * tags:
 *   name: Admin - Recruiters
 *   description: Admin CRUD for recruiter accounts
 */

/**
 * @swagger
 * /api/admin/recruiters:
 *   get:
 *     summary: Get all recruiters
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
 *         description: Forbidden – admin only
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
 *         description: Recruiter created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 */
router.get('/', adminController.getRecruitersData);
router.post('/', adminController.createRecruiter);

/**
 * @swagger
 * /api/admin/recruiters/{userId}:
 *   put:
 *     summary: Update a recruiter by userId
 *     tags: [Admin - Recruiters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
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
 *       400:
 *         description: Invalid userId or no fields to update
 *       404:
 *         description: Recruiter not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a recruiter by userId
 *     tags: [Admin - Recruiters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64abc123def456"
 *     responses:
 *       200:
 *         description: Recruiter deleted successfully
 *       400:
 *         description: Invalid userId format
 *       404:
 *         description: Recruiter not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', adminController.updateRecruiter);
router.delete('/:userId', adminController.deleteRecruiter);

module.exports = router;
