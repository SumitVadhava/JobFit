const express = require("express");
const router = express.Router();
const job = require("../middlewares/jobsMid");
const jobController = require("../controllers/jobController");

router.post("/", job, jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);
router.put("/:id", job, jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
