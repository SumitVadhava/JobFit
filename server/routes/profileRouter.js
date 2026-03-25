const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Profile routes
router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;
