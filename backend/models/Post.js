const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [500, 'Post cannot exceed 500 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['assignment', 'coding', 'activities', 'sports', 'events', 'discussion']
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content:   { type: String, required: true, trim: true, maxlength: 300 },
        createdAt: { type: Date, default: Date.now }
    }],
    university: { type: String, required: true },
    campus:     { type: String, default: '' },
    isDeleted:  { type: Boolean, default: false }
}, { timestamps: true });

postSchema.index({ university: 1, createdAt: -1 });
postSchema.index({ author: 1 });

module.exports = mongoose.model('Post', postSchema);
