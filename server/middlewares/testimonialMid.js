const validateCreateTestimonial = (req, res, next) => {
  const { username, rating, reviewmsg } = req.body;

  if (!username) return res.status(400).json({ message: "username is required" });
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be a number between 1 and 5" });
  }
  if (!reviewmsg) return res.status(400).json({ message: "reviewmsg is required" });

  next();
};


module.exports = { validateCreateTestimonial };
