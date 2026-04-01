const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');
const { ROLES } = require('../utils/roles');
const {
  validateCreateRecruiterProfile,
  validateUpdateRecruiterProfile,
} = require('../middlewares/recruiterProfileMid');

const {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  getStats,
} = require('../controllers/recruiterProfileController');

// ── Multer: in-memory image upload ────────────────────────────
const imageFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.mimetype))
    return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
  cb(null, true);
};

const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadPhotoMiddleware = (req, res, next) => {
  uploadImage.single('profilePhoto')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ message: 'Profile photo must be 5 MB or smaller' });
    return res.status(400).json({ message: err.message || 'Invalid image upload' });
  });
};

// Role guard – recruiter-only
const recruiterOnly = authorizeRole(ROLES.RECRUITER);

/**
 * @swagger
 * tags:
 *   name: RecruiterProfile
 *   description: Recruiter profile management (POST / GET / PUT / DELETE)
 */

// ════════════════════════════════════════════════════════════
// POST  /api/recruiter-profile   — Create (first-time setup)
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile:
 *   post:
 *     summary: Create a new recruiter profile (first-time setup)
 *     description: Creates a brand-new profile for the authenticated recruiter. Returns 409 if a profile already exists — use PUT to update instead.
 *     tags: [RecruiterProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/RecruiterProfileRequest'
 *               - type: object
 *                 properties:
 *                   profilePhoto:
 *                     type: string
 *                     format: binary
 *                     description: Profile photo (JPEG / PNG / GIF / WebP, max 5 MB)
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecruiterProfileRequest'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile created successfully
 *                 profile:
 *                   $ref: '#/components/schemas/RecruiterProfile'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Profile already exists — use PUT to update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  auth,
  recruiterOnly,
  uploadPhotoMiddleware,
  validateCreateRecruiterProfile,
  createProfile,
);

// ════════════════════════════════════════════════════════════
// GET  /api/recruiter-profile/stats   — Live stats (auth)
// NOTE: must be declared BEFORE /:id to avoid route collision
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile/stats:
 *   get:
 *     summary: Get live hiring performance stats for the authenticated recruiter
 *     description: Returns jobsPosted (live count from jobs collection) and candidatesHired.
 *     tags: [RecruiterProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stats retrieved successfully
 *                 stats:
 *                   $ref: '#/components/schemas/RecruiterProfileStats'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', auth, recruiterOnly, getStats);

// ════════════════════════════════════════════════════════════
// GET  /api/recruiter-profile   — Own profile (auth)
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile:
 *   get:
 *     summary: Get the authenticated recruiter's own profile
 *     description: Returns the full profile for the currently logged-in recruiter. Also syncs the live jobsPosted count.
 *     tags: [RecruiterProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 profile:
 *                   $ref: '#/components/schemas/RecruiterProfile'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', auth, recruiterOnly, getMyProfile);

// ════════════════════════════════════════════════════════════
// GET  /api/recruiter-profile/:id   — Public profile by user ID
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile/{id}:
 *   get:
 *     summary: Get a recruiter's public profile by user ID
 *     description: No authentication required. The `id` is the recruiter's user (login) ObjectId.
 *     tags: [RecruiterProfile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user (login) ObjectId of the recruiter
 *         schema:
 *           type: string
 *           example: "64abc123def456"
 *     responses:
 *       200:
 *         description: Recruiter profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 profile:
 *                   $ref: '#/components/schemas/RecruiterProfile'
 *       400:
 *         description: Invalid or missing user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProfileById);

// ════════════════════════════════════════════════════════════
// PUT  /api/recruiter-profile   — Update existing profile (auth)
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile:
 *   put:
 *     summary: Update the authenticated recruiter's existing profile
 *     description: Partially updates the profile. Returns 404 if no profile exists — use POST to create one first. Only provided fields are updated.
 *     tags: [RecruiterProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/RecruiterProfileRequest'
 *               - type: object
 *                 properties:
 *                   profilePhoto:
 *                     type: string
 *                     format: binary
 *                     description: Profile photo (JPEG / PNG / GIF / WebP, max 5 MB)
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecruiterProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 profile:
 *                   $ref: '#/components/schemas/RecruiterProfile'
 *       400:
 *         description: Validation error — no fields provided or invalid value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found — use POST to create first
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/',
  auth,
  recruiterOnly,
  uploadPhotoMiddleware,
  validateUpdateRecruiterProfile,
  updateProfile,
);

// ════════════════════════════════════════════════════════════
// DELETE  /api/recruiter-profile   — Delete own profile (auth)
// ════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/recruiter-profile:
 *   delete:
 *     summary: Delete the authenticated recruiter's profile
 *     description: Permanently removes the recruiter's profile document from the database.
 *     tags: [RecruiterProfile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile deleted successfully
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/', auth, recruiterOnly, deleteProfile);

module.exports = router;
