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
      from: `theryit2024@gmail.com`, // or `"TTSDF (theryit2024)" <theryit2024@gmail.com>`
      to: email,
      subject: "Your OTP from TTSDF Foundation",
      text: `Hello, your OTP is: ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px;">
          <p>Hello,</p>
          <p>Your OTP is: <b>${otp}</b></p>
          <p>This code is valid for 5 minutes. If you didn’t request it, you can ignore this message.</p>
          <br>
          <p>— TTSDF Foundation</p>
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
