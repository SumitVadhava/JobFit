const axios = require("axios");
require("dotenv").config();

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

/**
 * Sends a support email to the official JobFit support address.
 * Features a professional, ticket-style template with high readability.
 * @param {Object} details - The contact details: name, email, subject, message.
 * @returns {Promise<boolean>} - Returns true if the email was sent successfully.
 */
async function sendSupportEmail({ name, email, subject, message }) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          .email-wrapper {
            background-color: #f3f4f6;
            padding: 40px 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          .card {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e7eb;
          }
          .header {
            padding: 24px 32px;
            border-bottom: 1px solid #f3f4f6;
            text-align: left;
            display: flex;
            align-items: center;
          }
          .header img {
            height: 32px;
          }
          .content {
            padding: 32px;
          }
          .ticket-header {
            margin-bottom: 24px;
          }
          .ticket-id {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          .subject-line {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin: 0;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 32px;
            border-top: 1px solid #f3f4f6;
            padding-top: 24px;
          }
          .meta-item {
            font-size: 14px;
          }
          .label {
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 500;
          }
          .value {
            color: #374151;
            font-weight: 600;
          }
          .message-box {
            background-color: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 6px;
            padding: 20px;
            position: relative;
          }
          .message-text {
            margin: 0;
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            white-space: pre-wrap;
          }
          .footer {
            padding: 24px 32px;
            background-color: #f9fafb;
            border-top: 1px solid #f3f4f6;
            text-align: center;
          }
          .footer-text {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="card">
            
            <div class="header">
              <img src="https://drive.google.com/uc?export=view&id=1v_SoU5Gq3FWkKyhQ6r0WSzJy6yHUVJ9R" alt="JobFit">
              <span style="margin-left: auto; font-size: 13px; color: #9ca3af; font-weight: 500;">Support Inquiry</span>
            </div>

            <div class="content">
              <div class="ticket-header">
                <p class="ticket-id">Topic / Category</p>
                <h2 class="subject-line">${subject}</h2>
              </div>

              <div style="border-top: 1px solid #f3f4f6; margin-bottom: 24px; padding-top: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50%" style="vertical-align: top; padding-right: 10px;">
                      <p style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">User Name</p>
                      <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">${name}</p>
                    </td>
                    <td width="50%" style="vertical-align: top; padding-left: 10px;">
                      <p style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Email Address</p>
                      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #2563eb;">${email}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="message-box">
                <p style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Message Content</p>
                <p class="message-text">${message}</p>
              </div>
            </div>

            <div class="footer">
              <p class="footer-text">This is an automated notification from JobFit Support.</p>
              <p class="footer-text">Professional response is required within 24 hours.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    to: "jobfits024@gmail.com",
    subject: `Support Inquiry: ${subject} - ${name}`,
    text: `New support message from ${name} (${email}):\n\n${message}`,
    html: htmlContent,
  };

  try {
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not set in environment variables");
    }

    const response = await axios.post(GOOGLE_SCRIPT_URL, mailOptions);

    if (response.data === "Success") {
      console.log(`Support inquiry from ${email} sent successfully.`);
      return true;
    } else {
      throw new Error(`Google Script Error: ${response.data}`);
    }
  } catch (error) {
    console.error("Error sending support email:", error.message);
    throw error;
  }
}

module.exports = {
  sendSupportEmail,
};
