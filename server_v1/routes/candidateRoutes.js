const express = require("express");
const router = express.Router();
const {
  getCandidateDashboard,
  getCandidateAtsAnalyzer,
  getCandidateJobs,
  getCandidateJobById,
  updateCandidateJob,
  getSavedJobs,
  getAppliedJobs,
  createAppliedJob,
} = require("../controllers/candidateController");

const { candidateAuth } = require("../middlewares/candidateMiddleware");

router.get("/dashboard", candidateAuth, getCandidateDashboard);
router.get("/ats-analyzer", candidateAuth, getCandidateAtsAnalyzer);
router.get("/jobs", candidateAuth, getCandidateJobs);
router.get("/jobs/:jobId", candidateAuth, getCandidateJobById);
router.put("/jobs/:jobId", candidateAuth, updateCandidateJob);
router.get("/saved-jobs", candidateAuth, getSavedJobs);
router.get("/applied-jobs", candidateAuth, getAppliedJobs);
router.post("/job/apply", candidateAuth, createAppliedJob);

module.exports = router;