const express = require("express");
const router = express.Router();

const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const {
  validateCreateTestimonial,
} = require("../middlewares/testimonialMid");

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
 *     responses:
 *       200:
 *         description: List of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 testimonials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 */
router.get("/", getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get a single testimonial by ID
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
 *         description: Testimonial retrieved successfully
 *       404:
 *         description: Testimonial not found
 */
router.get("/:id", getTestimonialById);

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
 */
router.post("/", validateCreateTestimonial, createTestimonial);


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
 */
router.delete("/:id", deleteTestimonial);

module.exports = router;
