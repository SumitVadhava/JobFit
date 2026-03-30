const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfName = String(file.originalname || "")
    .toLowerCase()
    .endsWith(".pdf");

  if (!isPdfMime || !isPdfName) {
    return cb(new Error("Only PDF files are allowed"));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadResumeMiddleware = (req, res, next) => {
  upload.single("pdf")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res
        .status(400)
        .json({ message: "Resume PDF must be 5MB or smaller" });
    }

    return res
      .status(400)
      .json({ message: error.message || "Invalid file upload" });
  });
};

const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  uploadResume,
} = require("../controllers/profileController");

const {
  validateCreateProfile,
  validateUpdateProfile,
} = require("../middlewares/profileMid");

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management (requires JWT)
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get("/", getProfile);

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create a new profile for the current user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       409:
 *         description: Profile already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateCreateProfile, createProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error — no updatable fields provided
 *       401:
 *         description: Unauthorized
 */
router.put("/", validateUpdateProfile, updateProfile);

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete the current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/", deleteProfile);

/**
 * @swagger
 * /api/profile/upload-resume:
 *   post:
 *     summary: Upload resume PDF to Cloudinary and link it to profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: No file provided
 *       401:
 *         description: Unauthorized
 */
router.post("/upload-resume", uploadResumeMiddleware, uploadResume);

module.exports = router;
