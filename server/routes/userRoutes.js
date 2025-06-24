import express from 'express';
import { LoginUser, RegisterUser, GoogleLogin, sendOTP } from '../controllers/userController.js'
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/google-login', GoogleLogin);
router.post('/send-otp', sendOTP);
router.post('/refresh-token', RefreshToken);


export default router;