const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const resume = require("../middlewares/resumeMid");

router.post("/upload", resume, resumeController.uploadResume);
router.get("/:userId", resumeController.getResumesByUserId);

module.exports = router;
