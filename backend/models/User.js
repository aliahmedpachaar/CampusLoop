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
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
        default: '',
    },
    university: {
        type: String,
        default: 'City University Malaysia',
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
    interests: [{ type: String, trim: true }],
    activitiesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    activitiesJoined:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],

    // Auth provider
    authProvider: {
        type: String,
        enum: ['email', 'google', 'apple'],
        default: 'email'
    },
    googleId: { type: String, default: '' },

    // Email verification
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP:        { type: String, select: false },
    emailVerificationOTPExpire:  { type: Date,   select: false },

    // Password reset
    passwordResetOTP:        { type: String, select: false },
    passwordResetOTPExpire:  { type: Date,   select: false },

    dateOfBirth: { type: Date, default: null },

    // Legacy field kept for backward compat
    isVerified: { type: Boolean, default: false },

    profileComplete: { type: Boolean, default: false },
    isActive:  { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date,    default: null },
    lastSeen:  { type: Date,    default: Date.now },
}, {
    timestamps: true
});

// ─── Hooks ──────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ─── Methods ────────────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicProfile = function () {
    return {
        id:                 this._id,
        email:              this.email,
        fullName:           this.fullName,
        university:         this.university,
        campus:             this.campus,
        course:             this.course,
        semester:           this.semester,
        bio:                this.bio,
        avatar:             this.avatar,
        interests:          this.interests,
        authProvider:       this.authProvider,
        emailVerified:      this.emailVerified,
        profileComplete:    this.profileComplete,
        activitiesCreated:  this.activitiesCreated,
        activitiesJoined:   this.activitiesJoined,
        createdAt:          this.createdAt,
    };
};

module.exports = mongoose.model('User', userSchema);
