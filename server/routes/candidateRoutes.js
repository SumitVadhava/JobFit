const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const candidateJobsController = require("../controllers/candidateJobsController");
const { candidateAuth, validateJobApplication, validateSavedJob, validateWithdrawal, validateCandidateProfileUpdate } = require("../middlewares/candidateMiddleware");
const { validateIds } = require("../middlewares/commonMiddleware");

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
router.get("/profile/:profileId", validateIds(["profileId"]), candidateController.getCandidateProfileById);

// All other candidate routes are protected and require the CANDIDATE role
router.use(candidateAuth);

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
router.get("/dashboard", candidateController.getCandidateDashboard);

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
router.get("/ats-analyzer", candidateController.getCandidateAtsAnalyzer);

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
router.get("/profile", candidateController.getCandidateProfile);


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
router.post("/profile", candidateController.createCandidateProfile);

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
router.put("/profile", validateCandidateProfileUpdate, candidateController.updateCandidateProfile);

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
router.delete("/profile", candidateController.deleteCandidateProfile);

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
router.get("/jobs", candidateJobsController.getCandidateJobs);

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
router.get("/jobs/:jobId", validateIds(["jobId"]), candidateJobsController.getCandidateJobById);

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
router.put("/jobs/:jobId", validateIds(["jobId"]), validateWithdrawal, candidateJobsController.updateCandidateJob);

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
router.post("/job/apply", validateJobApplication, validateIds(["jobId"]), candidateJobsController.createAppliedJob);

/**
 * @swagger
 * /api/candidate/saved-jobs:
 *   get:
 *     summary: Get all jobs saved by the candidate
 *     tags: [Candidate-Jobs]
 *     responses:
 *       200:
 *         description: List of saved jobs retrieved successfully
 */
router.get("/saved-jobs", candidateJobsController.getSavedJobs);

/**
 * @swagger
 * /api/candidate/saved-jobs/{jobId}:
 *   patch:
 *     summary: Save or unsave a job (toggle saved status)
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
 *             $ref: '#/components/schemas/SavedJobPatchRequest'
 *     responses:
 *       200:
 *         description: Job saved status updated successfully
 *       201:
 *         description: Job saved successfully
 */
router.patch("/saved-jobs/:jobId", validateIds(["jobId"]), validateSavedJob, candidateJobsController.patchSavedJob);

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
router.get("/applied-jobs", candidateJobsController.getAppliedJobs);

module.exports = router;
