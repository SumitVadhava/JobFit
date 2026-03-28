const express = require("express");
const router = express.Router();
const User = require("../models/login");
const { sendOtp, verifyOtp } = require("./../services/otp.service");

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: Email-based OTP for signup verification
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to an email address
 *     tags: [OTP]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully (or user already exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to send OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  let existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return res
      .status(200)
      .json({ message: "User already exists", user: existingUser });
  }

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await sendOtp(email);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for an email address
 *     tags: [OTP]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  const valid = verifyOtp(email, otp);

  if (!valid) return res.status(400).json({ error: "Invalid or expired OTP" });

  res.json({ message: "OTP verified successfully" });
});

module.exports = router;
