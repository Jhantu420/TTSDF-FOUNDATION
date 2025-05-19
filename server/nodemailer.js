import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Function to generate random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function to send OTP via email
export const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // Your email from .env
        pass: process.env.SMTP_PASS, // App password
      },
    });

    const mailOptions = {
      from: `"TTSDF Foundation" <theryit2024@gmail.com>`,
      to: email,
      subject: "Your TTSDF Code for Email Confirmation",
      text: `Hi, your code is: ${otp}. It will expire in 3 minutes.`,
      html: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
      <h2 style="color:#333;">Welcome to TTSDF</h2>
      <p>Hi <b>${email}</b>,</p>
      <p>Your code is: <b style="font-size: 18px;">${otp}</b></p>
      <p>This code will expire in 3 minutes.</p>
      <p>If you didn't expect this message, feel free to disregard it.</p>
      <br>
      <p style="font-size:12px;color:gray;">TTSDF Foundation</p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("OTP sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};
