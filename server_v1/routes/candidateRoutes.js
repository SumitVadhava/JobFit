const express = require("express");
const router = express.Router();
const {
  getCandidateDashboard,
  getCandidateAtsAnalyzer,
  getCandidateProfile,
  getCandidateProfileById,
  createCandidateProfile,
  updateCandidateProfile,
  deleteCandidateProfile,
  getCandidateJobs,
  getCandidateJobById,
  updateCandidateJob,
  getSavedJobs,
  patchSavedJob,
  getAppliedJobs,
  createAppliedJob,
} = require("../controllers/candidateController");

const { protect, authorize } = require("../middlewares/authMiddleware");
const { ROLES } = require("../utils/roles");

// All candidate routes are protected and require the CANDIDATE role
router.use(protect);
router.use(authorize(ROLES.CANDIDATE));

/**
 * @swagger
 * tags:
 *   name: Candidate
 *   description: Candidate specific operations (Dashboard, ATS, Profile)
 */

/**
 * @swagger
 * /api/candidate/dashboard:
 *   get:
 *     summary: Get candidate dashboard statistics (Applied/Saved jobs, ATS score)
 *     tags: [Candidate]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get("/dashboard", getCandidateDashboard);

/**
 * @swagger
 * /api/candidate/ats-analyzer:
 *   get:
 *     summary: Get candidate's detailed ATS scores history
 *     tags: [Candidate]
 *     responses:
 *       200:
 *         description: ATS score history retrieved
 */
router.get("/ats-analyzer", getCandidateAtsAnalyzer);

/**
 * @swagger
 * /api/candidate/profile:
 *   get:
 *     summary: Get candidate profile
 *     tags: [Candidate]
 *     responses:
 *       200:
 *         description: Candidate profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get("/profile", getCandidateProfile);

/**
 * @swagger
 * /api/candidate/profile/{profileId}:
 *   get:
 *     summary: Get candidate profile by ID
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the candidate profile
 *     responses:
 *       200:
 *         description: Candidate profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get("/profile/:profileId", getCandidateProfileById);

/**
 * @swagger
 * /api/candidate/profile:
 *   post:
 *     summary: Create candidate profile
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateProfileRequest'
 *     responses:
 *       201:
 *         description: Candidate profile created successfully
 *       400:
 *         description: Profile already exists
 */
router.post("/profile", createCandidateProfile);

/**
 * @swagger
 * /api/candidate/profile:
 *   put:
 *     summary: Update candidate profile
 *     tags: [Candidate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CandidateProfileRequest'
 *     responses:
 *       200:
 *         description: Candidate profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.put("/profile", updateCandidateProfile);

/**
 * @swagger
 * /api/candidate/profile:
 *   delete:
 *     summary: Delete candidate profile
 *     tags: [Candidate]
 *     responses:
 *       200:
 *         description: Candidate profile deleted successfully
 *       404:
 *         description: Profile not found
 */
router.delete("/profile", deleteCandidateProfile);

/**
 * @swagger
 * tags:
 *   name: Candidate-Jobs
 *   description: Candidate job operations (Browse, Apply, Save)
 */

/**
 * @swagger
 * /api/candidate/jobs:
 *   get:
 *     summary: Get all available jobs for candidates
 *     tags: [Candidate-Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/jobs", getCandidateJobs);

/**
 * @swagger
 * /api/candidate/jobs/{jobId}:
 *   get:
 *     summary: Get details of a specific job
 *     tags: [Candidate-Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job details
 */
router.get("/jobs/:jobId", getCandidateJobById);

/**
 * @swagger
 * /api/candidate/jobs/{jobId}:
 *   put:
 *     summary: Withdraw from a job (Action - withdraw)
 *     tags: [Candidate-Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action: { type: string, enum: [withdraw] }
 *     responses:
 *       200:
 *         description: Action successful
 */
router.put("/jobs/:jobId", updateCandidateJob);

/**
 * @swagger
 * /api/candidate/job/apply:
 *   post:
 *     summary: Formally apply to a specific job
 *     tags: [Candidate-Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId: { type: string }
 *     responses:
 *       201:
 *         description: Application successful
 */
router.post("/job/apply", createAppliedJob);

/**
 * @swagger
 * /api/candidate/saved-jobs:
 *   get:
 *     summary: Get all jobs saved by the candidate
 *     tags: [Candidate-Jobs]
 *     responses:
 *       200:
 *         description: List of saved jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: boolean, example: false }
 *                 message: { type: string, example: "Saved jobs retrieved successfully." }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedJob'
 */
router.get("/saved-jobs", getSavedJobs);

/**
 * @swagger
 * /api/candidate/saved-jobs/{jobId}:
 *   patch:
 *     summary: Save or unsave a job (toggle saved status)
 *     description: Update the saved status of a job. Set saved to true to save, or false to unsave.
 *     tags: [Candidate-Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the job to save/unsave
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavedJobPatchRequest'
 *     responses:
 *       200:
 *         description: Job saved status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: boolean, example: false }
 *                 message: { type: string, example: "Job unsaved successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/SavedJob'
 *       201:
 *         description: Job saved successfully (new record created)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: boolean, example: false }
 *                 message: { type: string, example: "Job saved successfully." }
 *                 data:
 *                   $ref: '#/components/schemas/SavedJob'
 *       400:
 *         description: Invalid job ID or invalid saved status
 *       404:
 *         description: Job not found or job was not saved
 *       500:
 *         description: Server error
 */
router.patch("/saved-jobs/:jobId", patchSavedJob);

/**
 * @swagger
 * /api/candidate/applied-jobs:
 *   get:
 *     summary: Get all jobs applied to by the candidate
 *     tags: [Candidate-Jobs]
 *     responses:
 *       200:
 *         description: List of applied jobs
 */
router.get("/applied-jobs", getAppliedJobs);

module.exports = router;
