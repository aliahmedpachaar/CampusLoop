/**
 * CampusLoop Backend - Auth Routes
 */

const express = require('express');
const router  = express.Router();
const {
    signup, verifyOTP, resendOTP, completeProfile,
    login, getMe, googleAuth,
    forgotPassword, resetPassword, deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post  ('/signup',           signup);
router.post  ('/verify-otp',       verifyOTP);
router.post  ('/resend-otp',       resendOTP);
router.post  ('/complete-profile', protect, completeProfile);
router.post  ('/login',            login);
router.get   ('/me',               protect, getMe);
router.post  ('/google',           googleAuth);
router.post  ('/forgot-password',  forgotPassword);
router.post  ('/reset-password',   resetPassword);
router.delete('/account',          protect, deleteAccount);

module.exports = router;
