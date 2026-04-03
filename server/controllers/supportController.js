const { sendSupportEmail } = require("../services/email.service.js");

/**
 * Controller to handle contact support form submission.
 */
const contactSupport = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: true,
        message: "Please provide all required fields: name, email, subject, and message.",
      });
    }

    const success = await sendSupportEmail({ name, email, subject, message });

    if (success) {
      return res.status(200).json({
        success: true,
        message: "Your message has been sent successfully. We will get back to you soon.",
      });
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Support Controller Error:", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error while sending message. Please try again later.",
      details: error.message,
    });
  }
};

module.exports = {
  contactSupport,
};
