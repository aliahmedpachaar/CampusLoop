/**
 * CampusLoop Backend - Activity Controller
 */

const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const { type, status, university, campus, limit = 20, page = 1 } = req.query;

        // Build query
        const query = { status: status || 'active' };

        if (type && type !== 'all') {
            query.type = type;
        }

        if (university) {
            query.university = university;
        }

        if (campus) {
            query.campus = campus;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const activities = await Activity.find(query)
            .populate('creator', 'fullName avatar university')
            .populate('participants.user', 'fullName avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Activity.countDocuments(query);

        // Add isJoined and isCreator flags for current user
        const activitiesWithFlags = activities.map(activity => {
            const activityObj = activity.toObject();
            activityObj.isJoined = activity.isParticipant(req.user.id);
            activityObj.isCreator = activity.isCreator(req.user.id);
            return activityObj;
        });

        res.json({
            success: true,
            data: activitiesWithFlags,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching activities'
        });
    }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('creator', 'fullName avatar university bio')
            .populate('participants.user', 'fullName avatar university');

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        const activityObj = activity.toObject();
        activityObj.isJoined = activity.isParticipant(req.user.id);
        activityObj.isCreator = activity.isCreator(req.user.id);

        res.json({
            success: true,
            data: activityObj
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching activity'
        });
    }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { type, title, description, location, scheduledDate, maxParticipants, tags } = req.body;

        // Create activity
        const activity = await Activity.create({
            creator: req.user.id,
            type,
            title,
            description,
            university: req.user.university,
            campus: req.user.campus || '',
            location: location || '',
            scheduledDate: scheduledDate || null,
            maxParticipants,
            tags: tags || [],
            participants: [{
                user: req.user.id,
                status: 'accepted'
            }]
        });

        // Update user's activitiesCreated
        await User.findByIdAndUpdate(req.user.id, {
            $push: { activitiesCreated: activity._id, activitiesJoined: activity._id }
        });

        // Populate and return
        await activity.populate('creator', 'fullName avatar university');

        res.status(201).json({
            success: true,
            message: 'Activity created successfully',
            data: activity
        });
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating activity'
        });
    }
};

// @desc    Join activity
// @route   POST /api/activities/:id/join
// @access  Private
const joinActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        // Check if activity is still active
        if (activity.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Activity is no longer active'
            });
        }

        // Check if already joined
        if (activity.isParticipant(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already joined this activity'
            });
        }

        // Check if spots available
        const currentCount = activity.participants.filter(p => p.status === 'accepted').length;
        if (currentCount >= activity.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Activity is full'
            });
        }

        // Add participant
        activity.participants.push({
            user: req.user.id,
            status: 'accepted'
        });
        await activity.save();

        // Update user's activitiesJoined
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { activitiesJoined: activity._id }
        });

        // Notify activity creator
        if (!activity.isCreator(req.user.id)) {
            await Notification.create({
                recipient: activity.creator,
                sender: req.user.id,
                type: 'activity_join',
                title: 'New participant!',
                message: `${req.user.fullName} joined your activity "${activity.title}"`,
                activity: activity._id
            });
        }

        res.json({
            success: true,
            message: 'Successfully joined activity'
        });
    } catch (error) {
        console.error('Join activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error joining activity'
        });
    }
};

// @desc    Leave activity
// @route   POST /api/activities/:id/leave
// @access  Private
const leaveActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        // Check if user is creator
        if (activity.isCreator(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Creator cannot leave. Cancel the activity instead.'
            });
        }

        // Check if user is participant
        if (!activity.isParticipant(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You are not a participant of this activity'
            });
        }

        // Remove participant
        activity.participants = activity.participants.filter(
            p => p.user.toString() !== req.user.id.toString()
        );
        await activity.save();

        // Update user's activitiesJoined
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { activitiesJoined: activity._id }
        });

        // Notify activity creator
        await Notification.create({
            recipient: activity.creator,
            sender: req.user.id,
            type: 'activity_leave',
            title: 'Participant left',
            message: `${req.user.fullName} left your activity "${activity.title}"`,
            activity: activity._id
        });

        res.json({
            success: true,
            message: 'Successfully left activity'
        });
    } catch (error) {
        console.error('Leave activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error leaving activity'
        });
    }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (creator only)
const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        // Check if user is creator
        if (!activity.isCreator(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this activity'
            });
        }

        const { title, description, location, scheduledDate, maxParticipants, status } = req.body;

        // Update fields
        if (title) activity.title = title;
        if (description) activity.description = description;
        if (location !== undefined) activity.location = location;
        if (scheduledDate !== undefined) activity.scheduledDate = scheduledDate;
        if (maxParticipants) activity.maxParticipants = maxParticipants;
        if (status) activity.status = status;

        await activity.save();

        res.json({
            success: true,
            message: 'Activity updated successfully',
            data: activity
        });
    } catch (error) {
        console.error('Update activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating activity'
        });
    }
};

// @desc    Delete/Cancel activity
// @route   DELETE /api/activities/:id
// @access  Private (creator only)
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        // Check if user is creator
        if (!activity.isCreator(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this activity'
            });
        }

        // Notify all participants
        const participantIds = activity.participants
            .filter(p => p.user.toString() !== req.user.id.toString())
            .map(p => p.user);

        for (const participantId of participantIds) {
            await Notification.create({
                recipient: participantId,
                sender: req.user.id,
                type: 'activity_cancelled',
                title: 'Activity cancelled',
                message: `The activity "${activity.title}" has been cancelled by the creator`
            });
        }

        // Remove from users' activitiesJoined
        await User.updateMany(
            { activitiesJoined: activity._id },
            { $pull: { activitiesJoined: activity._id } }
        );

        // Remove from creator's activitiesCreated
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { activitiesCreated: activity._id }
        });

        // Delete activity
        await activity.deleteOne();

        res.json({
            success: true,
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting activity'
        });
    }
};

// @desc    Get my activities (created + joined)
// @route   GET /api/activities/my
// @access  Private
const getMyActivities = async (req, res) => {
    try {
        const { type } = req.query; // 'created' or 'joined' or undefined for all

        let activities;

        if (type === 'created') {
            activities = await Activity.find({ creator: req.user.id })
                .populate('creator', 'fullName avatar')
                .populate('participants.user', 'fullName avatar')
                .sort({ createdAt: -1 });
        } else if (type === 'joined') {
            activities = await Activity.find({
                'participants.user': req.user.id,
                creator: { $ne: req.user.id }
            })
                .populate('creator', 'fullName avatar')
                .populate('participants.user', 'fullName avatar')
                .sort({ createdAt: -1 });
        } else {
            activities = await Activity.find({
                $or: [
                    { creator: req.user.id },
                    { 'participants.user': req.user.id }
                ]
            })
                .populate('creator', 'fullName avatar')
                .populate('participants.user', 'fullName avatar')
                .sort({ createdAt: -1 });
        }

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Get my activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching activities'
        });
    }
};

module.exports = {
    getActivities,
    getActivity,
    createActivity,
    joinActivity,
    leaveActivity,
    updateActivity,
    deleteActivity,
    getMyActivities
};
