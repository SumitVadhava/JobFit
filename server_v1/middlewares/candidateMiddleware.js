const { protect, authorize } = require("./authMiddleware");

const candidateAuth = [protect, authorize("candidate")];

module.exports = { candidateAuth };