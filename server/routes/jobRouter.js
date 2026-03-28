const express = require("express");
const router = express.Router();
const job = require("../middlewares/jobsMid");
const jobController = require("../controllers/jobController");
const authorizeRole = require("../middlewares/authorizeRole");
const { ROLES } = require("../utils/roles");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings management (requires JWT)
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job listing (recruiter only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRequest'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter role required
 */
router.post("/", authorizeRole(ROLES.RECRUITER), job, jobController.createJob);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job listings
 *     tags: [Jobs]
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
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 */
router.get("/", jobController.getAllJobs);

/**
 * @swagger
 * /api/jobs/recruiter/{recruiterId}:
 *   get:
 *     summary: Get jobs created by the logged-in recruiter
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recruiterId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recruiter user ID (must match token user id)
 *     responses:
 *       200:
 *         description: Recruiter jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recruiter jobs retrieved successfully
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid recruiter id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (recruiter can access only own jobs)
 */
router.get(
  "/recruiter/:recruiterId",
  authorizeRole(ROLES.RECRUITER),
  jobController.getRecruiterOwnJobs,
);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job (candidate only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID
 *     responses:
 *       201:
 *         description: Job applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplyJobResponse'
 *       400:
 *         description: Invalid job id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - candidate role required
 *       404:
 *         description: Job not found
 *       409:
 *         description: Already applied to this job
 */
router.post(
  "/:id/apply",
  authorizeRole(ROLES.CANDIDATE),
  jobController.applyForJob,
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a specific job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", jobController.getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update an existing job listing (recruiter owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRequest'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter can update only own jobs
 */
router.put(
  "/:id",
  authorizeRole(ROLES.RECRUITER),
  job,
  jobController.updateJob,
);

/**
 * @swagger
 * /api/jobs/{id}/admin-review:
 *   patch:
 *     summary: Update admin review status for a job (admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminReviewUpdateRequest'
 *     responses:
 *       200:
 *         description: Job admin review status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request payload or invalid job id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *       404:
 *         description: Job not found
 */
router.patch(
  "/:id/admin-review",
  authorizeRole(ROLES.ADMIN),
  jobController.updateJobAdminReview,
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job listing (admin any, recruiter own)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter can delete only own jobs
 */
router.delete(
  "/:id",
  authorizeRole(ROLES.ADMIN, ROLES.RECRUITER),
  jobController.deleteJob,
);

module.exports = router;
