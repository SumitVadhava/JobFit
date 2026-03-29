const Testimonial = require("../models/testimonial");

const handleError = (res, error, defaultMessage = "Server error") => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message, errors: error.errors });
  }
  res.status(500).json({ message: defaultMessage, error: error.message });
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ date: -1 });
    res.status(200).json({ message: "Testimonials retrieved successfully", testimonials });
  } catch (error) {
    handleError(res, error, "Error retrieving testimonials");
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial retrieved successfully", testimonial });
  } catch (error) {
    handleError(res, error, "Error retrieving testimonial");
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { username, rating, reviewmsg } = req.body;

    const testimonial = await Testimonial.create({
      username,
      rating,
      reviewmsg,
    });

    res.status(201).json({ message: "Testimonial created successfully", testimonial });
  } catch (error) {
    handleError(res, error, "Error creating testimonial");
  }
};


exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting testimonial");
  }
};
