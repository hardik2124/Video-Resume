import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import otpGenerator from "otp-generator";
import { sendOtpViaMail } from '../utills/sendOtpViaEmail.js';
import OTP from '../models/otp.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return sendError(res, 'Please provide all required fields', 400);
    }

    if (await User.findOne({ email })) {
      return sendError(res, 'User already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      token
    }, 'User registered successfully', 201);

  } catch (error) {
    return sendError(res, 'Internal server error', 500, error.message);
  }
};


export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return sendError(res, 'Please provide all required fields', 400);
    }

    const user = await User.findOne({ email });
    if (!user)
      return sendError(res, 'Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return sendError(res, 'Invalid credentials', 401);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      token
    }, 'User logged in successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500, error.message);
  }
};



import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const GoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;  // Receive ID token from frontend

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing Google ID Token'
      });
    }

    // Verify ID Token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        profileImage: picture,  // you can store profile picture if you want
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        profileImage: user.profileImage
      },
      token,
      success: true,
      message: 'Google Login Successful'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message
    });
  }
}



export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return sendError(res, 'Email is required', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save OTP into database (Optional: if you want verification flow)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // your App Password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification OTP',
      text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    return sendSuccess(res, { otp }, 'OTP sent successfully');
  } catch (error) {
    return sendError(res, 'Failed to send OTP', 500, error.message);
  }
};