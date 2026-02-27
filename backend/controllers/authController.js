/**
 * CampusLoop Backend - Auth Controller
 *
 * Sign Up  : name + email + dateOfBirth + password  → OTP sent → verify → profile setup (campus)
 * Sign In  : email + password  OR  Google Sign-In
 * Forgot PW: email + dateOfBirth must match → OTP sent → reset password
 * Delete   : soft-delete, blocks future login with same email
 */

const crypto = require('crypto');
const User         = require('../models/User');
const Notification = require('../models/Notification');
const { generateToken } = require('../middleware/auth');
const { sendVerificationOTP, sendPasswordResetOTP } = require('../utils/email');

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// ─── Sign Up ──────────────────────────────────────────────────────────────────
// POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { email, password, fullName, dateOfBirth } = req.body;

        if (!email || !password || !fullName || !dateOfBirth) {
            return res.status(400).json({ success: false, message: 'Name, email, date of birth and password are all required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });

        if (existing) {
            if (existing.isDeleted) {
                return res.status(400).json({ success: false, message: 'This email is associated with a deleted account. Please use a different email.' });
            }
            if (!existing.emailVerified) {
                // Resend OTP so they can complete verification
                const otp = generateOTP();
                existing.emailVerificationOTP       = otp;
                existing.emailVerificationOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
                await existing.save({ validateBeforeSave: false });
                await sendVerificationOTP(normalizedEmail, otp, existing.fullName);
                return res.status(409).json({
                    success: false, code: 'EMAIL_UNVERIFIED',
                    message: 'This email is already registered but not verified. A new code has been sent.',
                    email: normalizedEmail,
                });
            }
            return res.status(409).json({ success: false, code: 'EMAIL_EXISTS', message: 'An account with this email already exists. Please sign in.' });
        }

        const otp = generateOTP();
        await User.create({
            email:                      normalizedEmail,
            password,
            fullName:                   fullName.trim(),
            dateOfBirth:                new Date(dateOfBirth),
            university:                 'City University Malaysia',
            profileComplete:            false,
            emailVerified:              false,
            emailVerificationOTP:       otp,
            emailVerificationOTPExpire: new Date(Date.now() + 10 * 60 * 1000),
        });

        await sendVerificationOTP(normalizedEmail, otp, fullName.trim());

        res.status(201).json({ success: true, message: 'Verification code sent to your email.', email: normalizedEmail });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error during sign up.' });
    }
};

// ─── Verify OTP (after signup) ────────────────────────────────────────────────
// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and code are required.' });

        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+emailVerificationOTP +emailVerificationOTPExpire');

        if (!user) return res.status(404).json({ success: false, message: 'Account not found.' });
        if (user.isDeleted) return res.status(400).json({ success: false, message: 'This account has been deleted.' });

        if (!user.emailVerificationOTP || user.emailVerificationOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Incorrect code. Please check and try again.' });
        }
        if (user.emailVerificationOTPExpire < new Date()) {
            return res.status(400).json({ success: false, code: 'OTP_EXPIRED', message: 'Code has expired. Please request a new one.' });
        }

        user.emailVerified              = true;
        user.isVerified                 = true;
        user.emailVerificationOTP       = undefined;
        user.emailVerificationOTPExpire = undefined;
        user.lastSeen = new Date();
        await user.save({ validateBeforeSave: false });

        const token        = generateToken(user._id);
        const needsProfile = !user.profileComplete;

        res.json({ success: true, data: { user: user.toPublicProfile(), token, needsProfile } });
    } catch (err) {
        console.error('verifyOTP error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: 'Account not found.' });

        const otp = generateOTP();
        user.emailVerificationOTP       = otp;
        user.emailVerificationOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        await sendVerificationOTP(email.toLowerCase(), otp, user.fullName);
        res.json({ success: true, message: 'A new code has been sent to your email.' });
    } catch (err) {
        console.error('resendOTP error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Complete Profile (campus + course after first sign up) ───────────────────
// POST /api/auth/complete-profile  (requires auth)
const completeProfile = async (req, res) => {
    try {
        const { campus, course } = req.body;
        if (!campus) return res.status(400).json({ success: false, message: 'Please select your campus.' });

        const user = await User.findById(req.user.id);
        if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found.' });

        user.campus          = campus;
        user.course          = course || '';
        user.university      = 'City University Malaysia';
        user.profileComplete = true;
        await user.save({ validateBeforeSave: false });

        await Notification.create({
            recipient: user._id, type: 'welcome',
            title:     'Welcome to CampusLoop! 🎉',
            message:   'Start connecting with your campus community. Create or join activities!',
        });

        const token = generateToken(user._id);
        res.json({ success: true, data: { user: user.toPublicProfile(), token } });
    } catch (err) {
        console.error('completeProfile error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Sign In ──────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || user.isDeleted) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
        }
        if (user.authProvider === 'google' && !user.password) {
            return res.status(401).json({ success: false, message: 'This account was created with Google. Please tap "Continue with Google" to sign in.' });
        }
        if (!user.emailVerified) {
            // Auto-send fresh OTP
            const otp = generateOTP();
            user.emailVerificationOTP       = otp;
            user.emailVerificationOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
            await user.save({ validateBeforeSave: false });
            await sendVerificationOTP(email.toLowerCase(), otp, user.fullName);
            return res.status(403).json({
                success: false, code: 'EMAIL_NOT_VERIFIED',
                message: 'Please verify your email. A new code has been sent.',
                email: email.toLowerCase(),
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        user.lastSeen = new Date();
        await user.save({ validateBeforeSave: false });

        const token        = generateToken(user._id);
        const needsProfile = !user.profileComplete;

        res.json({ success: true, data: { user: user.toPublicProfile(), token, needsProfile } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during sign in.' });
    }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('activitiesCreated', 'title type status')
            .populate('activitiesJoined',  'title type status');
        if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, data: user.toPublicProfile() });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Google Auth ──────────────────────────────────────────────────────────────
// POST /api/auth/google
const googleAuth = async (req, res) => {
    try {
        const { email, googleId, fullName, avatar } = req.body;
        if (!email || !googleId) return res.status(400).json({ success: false, message: 'Google email and ID are required.' });

        let user = await User.findOne({ email: email.toLowerCase() });

        if (user && user.isDeleted) {
            return res.status(400).json({ success: false, message: 'This account has been deleted.' });
        }

        if (user) {
            if (!user.googleId) user.googleId = googleId;
            if (avatar && !user.avatar) user.avatar = avatar;
            user.emailVerified = true;
            user.isVerified    = true;
            user.lastSeen      = new Date();
            await user.save({ validateBeforeSave: false });
        } else {
            user = await User.create({
                email:           email.toLowerCase(),
                fullName:        fullName || '',
                avatar:          avatar   || '',
                googleId,
                authProvider:    'google',
                emailVerified:   true,
                isVerified:      true,
                profileComplete: false,
                isActive:        true,
            });
        }

        if (!user.isActive) return res.status(401).json({ success: false, message: 'This account has been deactivated.' });

        const token        = generateToken(user._id);
        const needsProfile = !user.profileComplete;

        res.json({ success: true, data: { user: user.toPublicProfile(), token, needsProfile } });
    } catch (err) {
        console.error('googleAuth error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Forgot Password (requires email + dateOfBirth to match) ─────────────────
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email, dateOfBirth } = req.body;
        if (!email || !dateOfBirth) {
            return res.status(400).json({ success: false, message: 'Email and date of birth are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || user.isDeleted || !user.emailVerified) {
            return res.status(404).json({ success: false, message: 'No account found with this email.' });
        }
        if (user.authProvider === 'google' && !user.password) {
            return res.status(400).json({ success: false, message: 'This account uses Google sign-in. Please sign in with Google.' });
        }
        if (!user.dateOfBirth) {
            return res.status(400).json({ success: false, message: 'Date of birth not set for this account.' });
        }

        // Compare dates (year, month, day only)
        const input  = new Date(dateOfBirth);
        const stored = new Date(user.dateOfBirth);
        const match  =
            input.getUTCFullYear() === stored.getUTCFullYear() &&
            input.getUTCMonth()    === stored.getUTCMonth()    &&
            input.getUTCDate()     === stored.getUTCDate();

        if (!match) {
            return res.status(400).json({ success: false, message: 'Date of birth does not match our records. Please try again.' });
        }

        const otp = generateOTP();
        user.passwordResetOTP       = otp;
        user.passwordResetOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        await sendPasswordResetOTP(email.toLowerCase(), otp, user.fullName);

        res.json({ success: true, message: 'Reset code sent to your email.' });
    } catch (err) {
        console.error('forgotPassword error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: 'Email, code, and new password are required.' });
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+passwordResetOTP +passwordResetOTPExpire');

        if (!user) return res.status(404).json({ success: false, message: 'Account not found.' });
        if (!user.passwordResetOTP || user.passwordResetOTP !== otp) return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
        if (user.passwordResetOTPExpire < new Date()) return res.status(400).json({ success: false, code: 'OTP_EXPIRED', message: 'Code has expired. Please request a new one.' });

        user.password               = newPassword;
        user.passwordResetOTP       = undefined;
        user.passwordResetOTPExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully. Please sign in.' });
    } catch (err) {
        console.error('resetPassword error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─── Delete Account ───────────────────────────────────────────────────────────
// DELETE /api/auth/account  (requires auth)
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // Soft delete: anonymise personal data so email cannot be reused for login
        user.isDeleted    = true;
        user.deletedAt    = new Date();
        user.fullName     = '[Deleted User]';
        user.bio          = '';
        user.avatar       = '';
        user.interests    = [];
        user.googleId     = undefined;
        user.password     = undefined;
        // Keep email hashed so we can block re-registration
        user.email        = `deleted_${user._id}@deleted.campusloop`;
        user.emailVerified = false;
        user.emailVerificationOTP       = undefined;
        user.passwordResetOTP           = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({ success: true, message: 'Account deleted successfully.' });
    } catch (err) {
        console.error('deleteAccount error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { signup, verifyOTP, resendOTP, completeProfile, login, getMe, googleAuth, forgotPassword, resetPassword, deleteAccount };
