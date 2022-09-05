import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
