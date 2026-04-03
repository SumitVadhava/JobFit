const mongoose = require("mongoose");

/**
 * Middleware to validate Testimonial creation
 */
const validateCreateTestimonial = (req, res, next) => {
  const { username, rating, reviewmsg } = req.body;

  if (!username) {
    return res.status(400).json({ error: true, message: "Username is required." });
  }

  if (rating === undefined || typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ error: true, message: "Rating must be a number between 1 and 5." });
  }

  if (!reviewmsg) {
    return res.status(400).json({ error: true, message: "Review message is required." });
  }

  next();
};

/**
 * Middleware to validate Testimonial ID
 */
const validateTestimonialId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: true, message: "Invalid testimonial ID format." });
  }

  next();
};

module.exports = {
  validateCreateTestimonial,
  validateTestimonialId,
};
