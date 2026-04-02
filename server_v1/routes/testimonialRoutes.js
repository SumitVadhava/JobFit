const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const { validateCreateTestimonial, validateTestimonialId } = require("../middlewares/testimonialMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { ROLES } = require("../utils/roles");

/**
 * @swagger
 * tags:
 *   name: Testimonial
 *   description: Manage user and platform testimonials
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Retrieve a list of all testimonials
 *     tags: [Testimonial]
 *     security: []
 *     responses:
 *       200:
 *         description: List of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: boolean, example: false }
 *                 message: { type: string, example: "Testimonials retrieved successfully." }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 */
router.get("/", testimonialController.getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get a single testimonial by ID
 *     tags: [Testimonial]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *       404:
 *         description: Testimonial not found
 */
router.get("/:id", validateTestimonialId, testimonialController.getTestimonialById);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonial]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestimonialRequest'
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, authorize(ROLES.CANDIDATE, ROLES.RECRUITER), validateCreateTestimonial, testimonialController.createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonial]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *       404:
 *         description: Testimonial not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete("/:id", protect, authorize(ROLES.ADMIN), validateTestimonialId, testimonialController.deleteTestimonial);

module.exports = router;
