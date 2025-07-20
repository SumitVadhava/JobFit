const express = require("express");
const router = express.Router();
const job = require("../middleware/job");
const jobController = require("../controllers/jobController");
const auth = require("../middlewares/auth");

router.post("/" ,job, jobController);

router.get("/", job,jobController);

router.get("/:id", job,jobController);

router.put("/:id",job, jobController);

router.delete("/:id",job, jobController);

module.exports = router;


// router.post("/", auth, job, jobController.createJob);
// router.get("/", auth, job, jobController.getAllJobs);
// router.get("/:id", auth, job, jobController.getJobById);
// router.put("/:id", auth, job, jobController.updateJob);
// router.delete("/:id", auth, job, jobController.deleteJob);

// module.exports = router;