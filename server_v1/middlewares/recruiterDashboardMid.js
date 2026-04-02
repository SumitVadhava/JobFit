const { protect, authorize } = require("./authMiddleware");

const recruiterAuth = [protect, authorize("recruiter")];

module.exports = { recruiterAuth };