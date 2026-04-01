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
 * /api/jobs/{jobId}/candidates:
 *   get:
 *     summary: Get all candidates who applied to a specific recruiter job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID owned by the logged-in recruiter
 *     responses:
 *       200:
 *         description: Candidates retrieved successfully
 *       400:
 *         description: Invalid job id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter can access only own jobs
 *       404:
 *         description: Job not found
 */
router.get(
  "/:jobId/candidates",
  authorizeRole(ROLES.RECRUITER),
  jobController.getCandidatesByJobId,
);

/**
 * @swagger
 * /api/jobs/recruiter/{recruiterId}/candidates:
 *   get:
 *     summary: Get all candidates across all jobs of a specific recruiter
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
 *         description: Candidates across recruiter jobs retrieved successfully
 *       400:
 *         description: Invalid recruiter id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter can access only own data
 */
router.get(
  "/recruiter/:recruiterId/candidates",
  authorizeRole(ROLES.RECRUITER),
  jobController.getCandidatesForRecruiterJobs,
);

/**
 * @swagger
 * /api/jobs/recruiter/{recruiterId}/candidates/unique-count:
 *   get:
 *     summary: Get total unique candidates across all jobs of a recruiter
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
 *         description: Unique candidates count retrieved successfully
 *       400:
 *         description: Invalid recruiter id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter can access only own data
 */
router.get(
  "/recruiter/:recruiterId/candidates/unique-count",
  authorizeRole(ROLES.RECRUITER),
  jobController.getUniqueCandidatesCountForRecruiter,
);

/**
 * @swagger
 * /api/jobs/{jobId}/candidates/{applicationId}/hire:
 *   patch:
 *     summary: Hire a candidate for a recruiter-owned job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID owned by logged-in recruiter
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application document ID from applied_jobs
 *     responses:
 *       200:
 *         description: Candidate hired successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Candidate hired successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: 69ccdaa8a27df422df97895d
 *                     applicationId:
 *                       type: string
 *                       example: 69cce447eafdb0789f73e9f3
 *                     openingsLeft:
 *                       type: number
 *                       example: 4
 *                     isHired:
 *                       type: boolean
 *                       example: true
 *                     removedUnhiredApplications:
 *                       type: number
 *                       example: 0
 *                     notifications:
 *                       type: object
 *                       properties:
 *                         selectedCandidateNotified:
 *                           type: boolean
 *                           example: true
 *                         notSelectedCandidatesNotified:
 *                           type: number
 *                           example: 0
 *       400:
 *         description: Invalid ids
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter role required
 *       404:
 *         description: Job or application not found
 *       409:
 *         description: Candidate already hired or no openings available
 */
router.patch(
  "/:jobId/candidates/:applicationId/hire",
  authorizeRole(ROLES.RECRUITER),
  jobController.hireCandidateForJob,
);

/**
 * @swagger
 * /api/jobs/{jobId}/candidates/{applicationId}/shortlist:
 *   patch:
 *     summary: Shortlist a candidate for a recruiter-owned job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID owned by logged-in recruiter
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application document ID from applied_jobs
 *     responses:
 *       200:
 *         description: Candidate shortlisted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Candidate shortlisted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: 69ccdaa8a27df422df97895d
 *                     applicationId:
 *                       type: string
 *                       example: 69cce447eafdb0789f73e9f3
 *                     status:
 *                       type: string
 *                       enum: [applied, shortlisted, rejected, hired]
 *                       example: shortlisted
 *                     notifications:
 *                       type: object
 *                       properties:
 *                         sent:
 *                           type: boolean
 *                           example: true
 *                         outcome:
 *                           type: string
 *                           example: shortlisted
 *       400:
 *         description: Invalid ids
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter role required
 *       404:
 *         description: Job or application not found
 *       409:
 *         description: Invalid status transition
 */
router.patch(
  "/:jobId/candidates/:applicationId/shortlist",
  authorizeRole(ROLES.RECRUITER),
  jobController.shortlistCandidateForJob,
);

/**
 * @swagger
 * /api/jobs/{jobId}/candidates/{applicationId}/reject:
 *   patch:
 *     summary: Reject a candidate for a recruiter-owned job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job document ID owned by logged-in recruiter
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application document ID from applied_jobs
 *     responses:
 *       200:
 *         description: Candidate rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Candidate rejected successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: 69ccdaa8a27df422df97895d
 *                     applicationId:
 *                       type: string
 *                       example: 69cce447eafdb0789f73e9f3
 *                     status:
 *                       type: string
 *                       enum: [applied, shortlisted, rejected, hired]
 *                       example: rejected
 *                     notifications:
 *                       type: object
 *                       properties:
 *                         sent:
 *                           type: boolean
 *                           example: true
 *                         outcome:
 *                           type: string
 *                           example: rejected
 *       400:
 *         description: Invalid ids
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - recruiter role required
 *       404:
 *         description: Job or application not found
 *       409:
 *         description: Invalid status transition
 */
router.patch(
  "/:jobId/candidates/:applicationId/reject",
  authorizeRole(ROLES.RECRUITER),
  jobController.rejectCandidateForJob,
);

/**
 * @swagger
 * /api/jobs/admin/candidates/unique-count:
 *   get:
 *     summary: Get total unique candidates across all jobs (admin)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unique candidates count retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.get(
  "/admin/candidates/unique-count",
  authorizeRole(ROLES.ADMIN),
  jobController.getUniqueCandidatesCountForAdmin,
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
 * /api/jobs/{id}/save:
 *   post:
 *     summary: Save a job for the current user (candidate/user)
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
 *         description: Job saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaveJobResponse'
 *       200:
 *         description: Job was already saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaveJobResponse'
 *       400:
 *         description: Invalid job id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - candidate/user role required
 *       404:
 *         description: Job not found
 */

router.post(
  "/:id/save",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  jobController.saveJob,
);

/**
 * @swagger
 * /api/jobs/{id}/unsave:
 *   delete:
 *     summary: Remove a saved job for the current user (candidate/user)
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
 *         description: Job removed from saved jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaveJobResponse'
 *       400:
 *         description: Invalid job id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - candidate/user role required
 *       404:
 *         description: Saved job not found
 */

router.delete(
  "/:id/unsave",
  authorizeRole(ROLES.CANDIDATE, ROLES.USER),
  jobController.unsaveJob,
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
