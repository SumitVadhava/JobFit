const express = require("express");
const router = express.Router();
const { contactSupport } = require("../controllers/supportController");

/**
 * @swagger
 * /api/support/contact:
 *   post:
 *     summary: Send a contact support message.
 *     description: Takes form data and sends an email to the JobFit support team.
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully sent the support message.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/contact", contactSupport);

module.exports = router;
