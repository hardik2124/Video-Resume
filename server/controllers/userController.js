import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import otpGenerator from "otp-generator";
import { sendOtpViaMail } from '../utils/sendOtpViaEmail.js';
import OTP from '../models/otp.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim() || !otp?.trim()) {
      return sendError(res, 'Please provide all required fields', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    if (await User.findOne({ email })) {
      return sendError(res, 'User already exists', 409);
    }

    const checkOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (!checkOTP || checkOTP.otp !== otp) {
      return sendError(res, 'Invalid or expired OTP', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash });
    await user.save();

    // 🔐 Generate Tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    // 🔐 Set Refresh Token in HTTP-Only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    });

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      accessToken
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

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    // Set refreshToken in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    });

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      accessToken
    }, 'User logged in successfully');
  } catch (error) {
    return sendError(res, 'Internal server error', 500, error.message);
  }
};






const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const GoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendError(res, 'Missing Google token', 400);
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email || !googleId) {
      return sendError(res, 'Invalid Google data', 400);
    }

    // Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    // Create Access & Refresh Tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    // Set Refresh Token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    });

    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan,
      accessToken
    }, 'Logged in with Google successfully');

  } catch (error) {
    return sendError(res, 'Google login failed', 500, error.message);
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return sendError(res, 'Email is required', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Save OTP into database (Optional: if you want verification flow)
    await OTP.create({
      email: email,
      otp: otp,
    });


    const response = await sendOtpViaMail(email, otp);

    if (!response) {
      console.error("Failed to send OTP email");
      return res.status(400).json({
        success: false,
        message: "something went wrong while sending otp mail !!",
      });
    }

    return sendSuccess(res, { otp }, 'OTP sent successfully');
  } catch (error) {
    return sendError(res, 'Failed to send OTP', 500, error.message);
  }
};


export const RefreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return sendError(res, 'Missing refresh token', 401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return sendError(res, 'Invalid refresh token', 403);

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      return sendSuccess(res, { accessToken }, 'Access token refreshed');
    });

  } catch (error) {
    return sendError(res, 'Internal server error', 500, error.message);
  }
};
