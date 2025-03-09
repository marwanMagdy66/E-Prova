import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/Mail.js";
import { Token } from "../../../DB/models/Token.js";
import bcryptjs from "bcryptjs";
import randomstring from "randomstring";


////register
export const register = asyncHandler(async (req, res, next) => {
  const {
    username,
    email,
    password,
    confirmPassword,
  } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new Error("Email already exists"));
  }

  if (password != confirmPassword) {
    return next(new Error("password must be same ", { cause: 409 }));
  }

  const token = jwt.sign(
    {
      username,
      email,
    },
    process.env.SECRET_KEY
  );

  await User.create({ ...req.body });
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000"; 
  const URL = `${BASE_URL}/auth/activate_account/${token}`;

  const sendMail = await sendEmail({
    to: email,
    subject: "🚀 Welcome to E-Prova Shop – Activate Your Account Now!",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #007bff;">Welcome to E-Prova Shop! 🎉</h2>
        <p style="font-size: 16px; color: #333;">Hello <strong>${username}</strong>,</p>
        <p style="font-size: 16px; color: #333;">We're thrilled to have you join us! To get started, please activate your account by clicking the button below:</p>
        <a href="${URL}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Activate My Account
        </a>
        <p style="font-size: 14px; color: #777; margin-top: 15px;">If you didn’t sign up for E-Prova Shop, please ignore this email.</p>
        <p style="font-size: 14px; color: #777;">Need help? Contact us anytime!</p>
        <p style="font-size: 14px; color: #007bff; font-weight: bold;">– The E-Prova Shop Team</p>
      </div>
    `,
  });

  if (!sendMail)
    return next(new Error("message not sent to email for verify Email"));

  return res.json({
    success: true,
    message: "check your email to activate ",
  });
});



///activate acc
export const activate_account = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  user.isConfirmed = true;
  await user.save();
  return res.json({ success: true, message: "Account activated" });
});

/// login page
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return next(new Error("Invalid email or password. Please try again.", { cause: 401 }));
  }

  if (!user.isConfirmed) {
    return next(new Error("Your account is not activated. Please check your email for the activation link.", { cause: 403 }));
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return next(new Error("Invalid email or password. Please try again.", { cause: 401 }));
  }

  const accessToken = jwt.sign({ email, id: user._id , role:user.role}, process.env.SECRET_KEY, { expiresIn: "5m" });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "Strict", 
    maxAge: 60 * 60 * 1000, 
  });

  return res.json({ success: true, message: "Logged in successfully", accessToken});
});

// forget password
export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const code = randomstring.generate({
    length: 6,
    charset: "alphanumeric",
  });

  user.forgetCode = code;
  await user.save();
  const mailOptions = {
    to: email,
    subject: "🔑 Reset Your Password - Action Required",
    html: `
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>We received a request to reset your password. Use the code below to proceed:</p>
      <h3 style="color: #007bff;">${code}</h3>
      <p>If you did not request this, please ignore this email. Your account is safe.</p>
      <p>Need help? Contact our support team.</p>
      <br>
      <p>Best regards,<br><strong>E-Prova Support Team</strong></p>
    `,
  };

  await sendEmail(mailOptions);

  if (!mailOptions) return next(new Error("message not sent to email "));
  return res.json({ success: true, message: "Code sent to your email" });
});

// reset password

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 404 }));
  if (user.forgetCode !== code)
    return next(new Error("Invalid code", { cause: 401 }));
  if (password !== confirmPassword)
    return next(
      new Error("Passwords do not match", {
        cause: 400,
      })
    );
  user.password = password;
  user.forgetCode = null;
  await user.save();
  await Token.deleteMany({ userId: user._id });
  return res.json({ success: true, message: "Password reset successfully" });
});
