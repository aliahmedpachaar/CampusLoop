/**
 * CampusLoop Backend - User Controller
 */

const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { fullName, university, campus, course, semester, bio, interests } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (fullName) user.fullName = fullName;
        if (university) user.university = university;
        if (campus !== undefined) user.campus = campus;
        if (course !== undefined) user.course = course;
        if (semester !== undefined) user.semester = semester;
        if (bio !== undefined) user.bio = bio;
        if (interests) user.interests = interests;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user.toPublicProfile()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
};

// @desc    Update avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: 'Avatar URL is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            data: { avatar: user.avatar }
        });
    } catch (error) {
        console.error('Update avatar error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating avatar'
        });
    }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error changing password'
        });
    }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('fullName university campus course semester bio avatar interests createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user'
        });
    }
};

// @desc    Deactivate account
// @route   DELETE /api/users/account
// @access  Private
const deactivateAccount = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { isActive: false });

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deactivating account'
        });
    }
};

module.exports = {
    updateProfile,
    updateAvatar,
    changePassword,
    getUserById,
    deactivateAccount
};
