/**
 * CampusLoop Backend - Activity Model
 */

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: [true, 'Activity type is required'],
        enum: ['study_group', 'assignment_help', 'sports', 'movies', 'trip', 'food', 'event', 'project', 'other']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    university: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    scheduledDate: {
        type: Date
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Max participants is required'],
        min: [2, 'Minimum 2 participants required'],
        max: [50, 'Maximum 50 participants allowed']
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'accepted'
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    chatEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for current participant count
activitySchema.virtual('currentParticipants').get(function() {
    return this.participants.filter(p => p.status === 'accepted').length;
});

// Virtual for spots left
activitySchema.virtual('spotsLeft').get(function() {
    return this.maxParticipants - this.currentParticipants;
});

// Check if user is participant
activitySchema.methods.isParticipant = function(userId) {
    return this.participants.some(p => {
        const participantId = p.user?._id || p.user;
        return participantId.toString() === userId.toString() && p.status === 'accepted';
    });
};

// Check if user is creator — works whether creator is populated or not
activitySchema.methods.isCreator = function(userId) {
    const creatorId = this.creator?._id || this.creator;
    return creatorId.toString() === userId.toString();
};

// Ensure virtuals are included in JSON
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

// Index for better query performance
activitySchema.index({ university: 1, type: 1, status: 1 });
activitySchema.index({ creator: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
