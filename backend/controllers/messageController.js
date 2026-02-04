/**
 * CampusLoop Backend - Message Controller
 */

const Message = require('../models/Message');
const Activity = require('../models/Activity');

// @desc    Get messages for an activity
// @route   GET /api/messages/:activityId
// @access  Private (participants only)
const getMessages = async (req, res) => {
    try {
        const { activityId } = req.params;
        const { limit = 50, before } = req.query;

        // Check if activity exists and user is participant
        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        if (!activity.isParticipant(req.user.id) && !activity.isCreator(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view messages'
            });
        }

        // Build query
        const query = { activity: activityId, isDeleted: false };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .populate('sender', 'fullName avatar')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Mark messages as read
        const messageIds = messages.map(m => m._id);
        await Message.updateMany(
            {
                _id: { $in: messageIds },
                'readBy.user': { $ne: req.user.id }
            },
            {
                $push: { readBy: { user: req.user.id } }
            }
        );

        res.json({
            success: true,
            data: messages.reverse() // Return in chronological order
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching messages'
        });
    }
};

// @desc    Send message
// @route   POST /api/messages/:activityId
// @access  Private (participants only)
const sendMessage = async (req, res) => {
    try {
        const { activityId } = req.params;
        const { content, messageType = 'text' } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required'
            });
        }

        // Check if activity exists and user is participant
        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        if (!activity.isParticipant(req.user.id) && !activity.isCreator(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages'
            });
        }

        if (!activity.chatEnabled) {
            return res.status(400).json({
                success: false,
                message: 'Chat is disabled for this activity'
            });
        }

        const message = await Message.create({
            activity: activityId,
            sender: req.user.id,
            content: content.trim(),
            messageType,
            readBy: [{ user: req.user.id }]
        });

        await message.populate('sender', 'fullName avatar');

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error sending message'
        });
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private (sender only)
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (message.sender.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this message'
            });
        }

        message.isDeleted = true;
        message.content = 'This message was deleted';
        await message.save();

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting message'
        });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    deleteMessage
};
