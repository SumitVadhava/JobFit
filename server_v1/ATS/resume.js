const express = require("express");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
const FormData = require("form-data");
const path = require("path");
const AtsHistory = require("../models/atsHistory");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jobDesc = req.body.jobDesc;

    const formData = new FormData();
    formData.append("pdf", fs.createReadStream(filePath));
    formData.append("jobDesc", jobDesc);

    const response = await axios.post(
      "https://jobfit-ats-api-1.onrender.com/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    // console.log("Resume analysis response:", response);
    // console.log("Resume analysis response: DATA ::", response.data);

    // Save to AtsHistory
    const userId = req.user ? req.user.id : null;
    if (userId && response.data && response.data.result) {
      const score = response.data.result["ATS Score"] || 0;

      await AtsHistory.findOneAndUpdate(
        { userId },
        {
          $push: {
            atsScores: {
              score: score,
              analyzedAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
            },
          },
          $set: { updatedAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000) },
        },
        { upsert: true, new: true },
      );
    }

    res.json({
      success: true,
      analysis: response.data,
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to analyze resume" });
  }
});

module.exports = router;
