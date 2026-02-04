/**
 * CampusLoop Backend - Message Routes
 */

const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes
router.get('/:activityId', getMessages);
router.post('/:activityId', sendMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;
