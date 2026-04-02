const express = require("express");
const router = express.Router();
const { getRecruiterDashboard } = require("../controllers/recruiterDashboardController");
const { recruiterAuth } = require("../middlewares/recruiterDashboardMid");

router.get("/dashboard", recruiterAuth, getRecruiterDashboard);

module.exports = router;