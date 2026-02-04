/**
 * CampusLoop Backend - Auth Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation rules
const signupValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('university').trim().notEmpty().withMessage('University is required')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
