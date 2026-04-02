const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { ROLES } = require("../utils/roles");

// All recruiter routes are protected and require the RECRUITER role
router.use(protect);
router.use(authorize(ROLES.RECRUITER));

/**
 * @swagger
 * tags:
 *   name: Recruiter
 *   description: Recruiter specific operations (Dashboard, Profile)
 */

/**
 * @swagger
 * /api/recruiter/dashboard:
 *   get:
 *     summary: Get recruiter dashboard statistics
 *     tags: [Recruiter]
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 */
router.get("/dashboard", recruiterController.getDashboardStats);

/**
 * @swagger
 * /api/recruiter/profile:
 *   get:
 *     summary: Get recruiter profile
 *     tags: [Recruiter]
 *     responses:
 *       200:
 *         description: Recruiter profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get("/profile", recruiterController.getRecruiterProfile);

/**
 * @swagger
 * /api/recruiter/profile/{profileId}:
 *   get:
 *     summary: Get recruiter profile by ID
 *     tags: [Recruiter]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema: { type: string }
 *         description: The ID of the recruiter profile
 *     responses:
 *       200:
 *         description: Recruiter profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get("/profile/:profileId", recruiterController.getRecruiterProfileById);

/**
 * @swagger
 * /api/recruiter/profile:
 *   post:
 *     summary: Create recruiter profile
 *     tags: [Recruiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecruiterProfileRequest'
 *     responses:
 *       201:
 *         description: Recruiter profile created successfully
 *       400:
 *         description: Profile already exists
 */
router.post("/profile", recruiterController.createRecruiterProfile);

/**
 * @swagger
 * /api/recruiter/profile:
 *   put:
 *     summary: Update recruiter profile
 *     tags: [Recruiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecruiterProfileRequest'
 *     responses:
 *       200:
 *         description: Recruiter profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.put("/profile", recruiterController.updateRecruiterProfile);

/**
 * @swagger
 * /api/recruiter/profile:
 *   patch:
 *     summary: Partial update of recruiter profile
 *     tags: [Recruiter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecruiterProfileRequest'
 *     responses:
 *       200:
 *         description: Recruiter profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.patch("/profile", recruiterController.patchRecruiterProfile);

/**
 * @swagger
 * /api/recruiter/profile:
 *   delete:
 *     summary: Delete recruiter profile
 *     tags: [Recruiter]
 *     responses:
 *       200:
 *         description: Recruiter profile deleted successfully
 *       404:
 *         description: Profile not found
 */
router.delete("/profile", recruiterController.deleteRecruiterProfile);

/**
 * @swagger
 * tags:
 *   name: Recruiter-Jobs
 *   description: Recruiter job operations (Post, Browse, Manage Applicants)
 */

/**
 * @swagger
 * /api/recruiter/jobs:
 *   post:
 *     summary: Post a new job listing
 *     tags: [Recruiter-Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [jobTitle, companyName, location, openings]
 *             properties:
 *               jobTitle: { type: string }
 *               companyName: { type: string }
 *               location: { type: string }
 *               openings: { type: integer }
 *               jobDescription: { type: string }
 *               department: { type: string }
 *               experience: { type: string }
 *               responsibilities: { type: array, items: { type: string } }
 *               qualifications: { type: array, items: { type: string } }
 *               workPlaceType: { type: string, enum: [Remote, "On-site", Hybrid] }
 *               img: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Job posted successfully
 */
router.post("/jobs", upload.single("img"), recruiterController.postJob);

/**
 * @swagger
 * /api/recruiter/jobs:
 *   get:
 *     summary: Get active jobs posted by the recruiter
 *     tags: [Recruiter-Jobs]
 *     responses:
 *       200:
 *         description: List of active jobs
 */
router.get("/jobs", recruiterController.getRecruiterJobs);

/**
 * @swagger
 * /api/recruiter/jobs/history:
 *   get:
 *     summary: Get completed job history (0 openings remaining)
 *     tags: [Recruiter-Jobs]
 *     responses:
 *       200:
 *         description: List of completed jobs
 */
router.get("/jobs/history", recruiterController.getJobHistory);

/**
 * @swagger
 * /api/recruiter/applicants:
 *   get:
 *     summary: Get applicants for jobs posted by the recruiter
 *     tags: [Recruiter-Jobs]
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter by a specific job ID
 *     responses:
 *       200:
 *         description: List of applicants with candidate and job details
 */
router.get("/applicants", recruiterController.getApplicants);

/**
 * @swagger
 * /api/recruiter/applicants/{applicationId}/status:
 *   patch:
 *     summary: Update the status of a job application (Hire, Shortlist, Reject)
 *     tags: [Recruiter-Jobs]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, shortlisted, hired, rejected]
 *     responses:
 *       200:
 *         description: Application status updated successfully (decrements job openings if status is "hired")
 */
router.patch("/applicants/:applicationId/status", recruiterController.updateApplicationStatus);

module.exports = router;
