const express = require("express");
const router = express.Router();
const atsHistoryController = require("../controllers/atsHistoryController");

router.get("/", atsHistoryController.getAtsHistory);

module.exports = router;
