import express from 'express';
import { LoginUser, RegisterUser, GoogleLogin, RefreshAccessToken, LogoutUser, sendOTP } from '../controllers/userController.js';
import { verifyRefreshToken } from '../middleware/verifyRefreshToken.js';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/google-login', GoogleLogin);
router.post('/send-otp', sendOTP);
router.get('/refresh-token', verifyRefreshToken, RefreshAccessToken);
router.post('/logout', verifyRefreshToken, LogoutUser);

export default router;