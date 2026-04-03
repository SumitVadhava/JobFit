const Testimonial = require("../models/testimonial");

/**
 * Get all testimonials
 */
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ date: -1 });

    res.status(200).json({
      error: false,
      message: "Testimonials retrieved successfully.",
      data: testimonials,
    });
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch testimonials.",
      details: error.message,
    });
  }
};

/**
 * Get single testimonial by ID
 */
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        error: true,
        message: "Testimonial not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "Testimonial retrieved successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Get Testimonial By ID Error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to fetch testimonial.",
      details: error.message,
    });
  }
};

/**
 * Create a new testimonial
 */
exports.createTestimonial = async (req, res) => {
  try {
    const { username, rating, reviewmsg } = req.body;

    const newTestimonial = new Testimonial({
      username,
      rating,
      reviewmsg,
    });

    await newTestimonial.save();

    res.status(201).json({
      error: false,
      message: "Testimonial created successfully.",
      data: newTestimonial,
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to create testimonial.",
      details: error.message,
    });
  }
};

/**
 * Delete a testimonial
 */
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        error: true,
        message: "Testimonial not found.",
      });
    }

    res.status(200).json({
      error: false,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({
      error: true,
      message: "Failed to delete testimonial.",
      details: error.message,
    });
  }
};
