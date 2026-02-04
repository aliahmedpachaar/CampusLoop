/**
 * CampusLoop Backend - User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    university: {
        type: String,
        required: [true, 'University is required'],
        trim: true
    },
    campus: {
        type: String,
        trim: true,
        default: ''
    },
    course: {
        type: String,
        trim: true,
        default: ''
    },
    semester: {
        type: String,
        trim: true,
        default: ''
    },
    bio: {
        type: String,
        maxlength: [200, 'Bio cannot exceed 200 characters'],
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    interests: [{
        type: String,
        trim: true
    }],
    activitiesCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    activitiesJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get public profile (exclude sensitive data)
userSchema.methods.toPublicProfile = function() {
    return {
        id: this._id,
        email: this.email,
        fullName: this.fullName,
        university: this.university,
        campus: this.campus,
        course: this.course,
        semester: this.semester,
        bio: this.bio,
        avatar: this.avatar,
        interests: this.interests,
        activitiesCreated: this.activitiesCreated,
        activitiesJoined: this.activitiesJoined,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
