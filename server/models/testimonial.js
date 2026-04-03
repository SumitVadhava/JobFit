const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewmsg: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), // Indian Standard Time (IST) UTC +5:30
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;