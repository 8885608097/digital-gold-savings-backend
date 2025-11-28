// src/utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable function
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Digital Gold App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent to:", to);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
}

module.exports = { sendEmail };
