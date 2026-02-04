/**
 * CampusLoop Backend - User Routes
 */

const express = require('express');
const router = express.Router();
const {
    updateProfile,
    updateAvatar,
    changePassword,
    getUserById,
    deactivateAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes
router.put('/profile', updateProfile);
router.put('/avatar', updateAvatar);
router.put('/password', changePassword);
router.delete('/account', deactivateAccount);
router.get('/:id', getUserById);

module.exports = router;
