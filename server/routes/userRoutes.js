import express from 'express';
import { LoginUser, RegisterUser, GoogleLogin, RefreshAccessToken, LogoutUser, sendOTP } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/google-login', GoogleLogin);
router.post('/send-otp', sendOTP);
router.get('/refresh-token', RefreshAccessToken);
router.post('/logout', LogoutUser);


export default router;