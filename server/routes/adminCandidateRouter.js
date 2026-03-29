const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');

/**
 * @swagger
 * tags:
 *   name: Admin - Candidates
 *   description: Admin CRUD operations for candidate accounts and profiles
 */

// ─────────────────────────────────────────────────────────
// CANDIDATE ACCOUNT CRUD
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/candidates:
 *   get:
 *     summary: Get all candidate accounts
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
 *         description: Forbidden – admin role required
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
 *         description: Candidate account created successfully
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
 *                   example: "candidate account created successfully"
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
 *                       example: "candidate"
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
 *     summary: Delete a candidate account by userId
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64abc123def456"
 *                 description: Valid MongoDB ObjectId of the candidate to delete
 *     responses:
 *       200:
 *         description: Candidate deleted successfully
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
 *                   example: "candidate deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: userId missing or invalid format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – user is not a candidate or admin role required
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.get('/', adminController.getCandidatesData);
router.post('/', adminController.createCandidate);
router.delete('/', adminController.deleteCandidate);

/**
 * @swagger
 * /api/admin/candidates/{userId}:
 *   put:
 *     summary: Update a candidate account by userId
 *     tags: [Admin - Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the candidate
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
 *                   example: "candidate updated successfully"
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
 *         description: Forbidden – user is not a candidate or admin role required
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', adminController.updateCandidate);

// ─────────────────────────────────────────────────────────
// CANDIDATE PROFILE CRUD
// ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/admin/candidates/profile:
 *   post:
 *     summary: Create a candidate profile (admin)
 *     description: Creates a new profile for a candidate user. Pass the user's MongoDB ObjectId as `userId` in the request body. The profile `_id` is auto-generated.
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64abc123def456"
 *                 description: Valid MongoDB ObjectId of the candidate user
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
router.post('/profile', adminController.createCandidateProfile);

/**
 * @swagger
 * /api/admin/candidates/{userId}/profile:
 *   get:
 *     summary: Get a candidate's profile by userId
 *     tags: [Admin - Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the candidate
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
 *                     resumeLink:
 *                       type: string
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
 *     tags: [Admin - Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the candidate
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
 *     tags: [Admin - Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Valid MongoDB ObjectId of the candidate
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
router.get('/:userId/profile', adminController.getCandidateProfile);
router.put('/:userId/profile', adminController.updateCandidateProfile);
router.delete('/:userId/profile', adminController.deleteCandidateProfile);

module.exports = router;
