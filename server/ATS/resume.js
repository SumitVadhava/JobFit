const express = require("express");
const axios = require("axios");
const fs = require("fs");
const multer = require("multer");
const FormData = require("form-data");
const path = require("path");

const router = express.Router();

// Multer config to store uploaded PDFs in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST /api/resume/upload
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jobDesc = req.body.jobDesc; // 👈 Received from frontend

    // Prepare multipart/form-data
    const formData = new FormData();
    formData.append("pdf", fs.createReadStream(filePath)); // 👈 Send PDF file
    formData.append("jobDesc", jobDesc); // 👈 Send Job Description text

    // Send to Python FastAPI backend
    const response = await axios.post(
      "https://jobfit-ats-api-1.onrender.com/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    // Send the AI's response back to the frontend
    res.json({
      success: true,
      analysis: response.data,
    });

    // Optional: Clean up the uploaded file
    // fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Resume analysis error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to analyze resume" });
  }
});

module.exports = router;
