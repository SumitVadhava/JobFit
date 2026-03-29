const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');

/**
 * @swagger
 * tags:
 *   name: Admin - Candidates
 *   description: Admin CRUD for candidate accounts
 */

/**
 * @swagger
 * /api/admin/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Admin - Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all candidates
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
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new candidate account
 *     tags: [Admin - Candidates]
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
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
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
 *         description: Candidate created successfully
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
router.get('/', adminController.getCandidatesData);
router.post('/', adminController.createCandidate);

/**
 * @swagger
 * /api/admin/candidates/{userId}:
 *   put:
 *     summary: Update a candidate by userId
 *     tags: [Admin - Candidates]
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
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Candidate updated successfully
 *       400:
 *         description: Invalid userId or no fields to update
 *       404:
 *         description: Candidate not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a candidate by userId
 *     tags: [Admin - Candidates]
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
 *         description: Candidate deleted successfully
 *       400:
 *         description: Invalid userId format
 *       404:
 *         description: Candidate not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', adminController.updateCandidate);
router.delete('/:userId', adminController.deleteCandidate);

module.exports = router;
