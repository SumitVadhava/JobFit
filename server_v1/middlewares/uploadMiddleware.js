const multer = require("multer");

/**
 * Configure multer to use memory storage.
 * This will provide file buffers in req.file.
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
