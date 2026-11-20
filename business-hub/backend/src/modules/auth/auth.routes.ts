import { Router } from 'express';
import {
  register,
  login,
  getMe,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from './auth.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', authenticateToken, verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
