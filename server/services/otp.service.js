const axios = require("axios");
const path = require("path");
require("dotenv").config();

const otpStore = new Map();

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

async function sendOtp(email) {
  const otp = generateOtp();

  const htmlContent = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 40px 0;">
      <tr>
        <td align="center">

          <!-- Main container -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 510px; width: 93%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">

            <!-- Logo -->
            <tr>
              <td align="center" style="margin: 10px; padding: 30px 20px 10px;" >
                <img src="https://drive.google.com/uc?export=view&id=1v_SoU5Gq3FWkKyhQ6r0WSzJy6yHUVJ9R" alt="JobFit Logo" style="width: 100px; height: auto; display: block;" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding: 0 30px 10px;">
                <h2 style="margin: 0; font-size: 24px; color: #333333;">Email Verification</h2>
                <p style="font-size: 15px; color: #555555;">Use the code below to verify your email address.</p>
              </td>
            </tr>

            <!-- OTP Code Box -->
            <tr>
              <td align="center" style="padding: 20px 30px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f0f5; border-radius: 10px; padding: 25px;">
                  <tr>
                    <td align="center" style="font-size: 36px; font-weight: bold; color: #2c2c2c; letter-spacing: 10px;">
                      ${otp}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Info text -->
            <tr>
              <td align="center" style="padding: 0 30px;">
                <p style="font-size: 14px; color: #777777; line-height: 1.5; margin-bottom: 20px;">
                  If you did not request this verification code, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f7f7f7; color: #888888; font-size: 12px; padding: 15px;">
                Copyright &copy; 2024 JobFit. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>`;

  const mailOptions = {
    to: email,
    subject: "Your One-Time Password (OTP) for Login",
    text: `Your OTP is: ${otp}`,
    html: htmlContent,
  };

  try {
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not set in environment variables");
    }

    const response = await axios.post(GOOGLE_SCRIPT_URL, mailOptions);

    if (response.data === "Success") {
      otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
      console.log(`OTP sent to ${email} via Google Script`);
      return otp;
    } else {
      throw new Error(`Google Script Error: ${response.data}`);
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

function verifyOtp(email, inputOtp) {
  const data = otpStore.get(email);
  if (!data || Date.now() > data.expiresAt) return false;

  const isValid = data.otp === inputOtp;

  if (isValid) otpStore.delete(email);

  return isValid;
}

module.exports = {
  sendOtp,
  verifyOtp,
};