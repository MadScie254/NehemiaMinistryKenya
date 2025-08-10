const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    speaker: {
        name: {
            type: String,
            required: true
        },
        title: String,
        bio: String,
        image: String
    },
    series: {
        name: String,
        description: String,
        image: String
    },
    scripture: {
        book: String,
        chapter: Number,
        verses: String,
        text: String
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    category: {
        type: String,
        enum: ['sunday-service', 'midweek', 'special-event', 'youth', 'children', 'womens', 'mens'],
        default: 'sunday-service'
    },
    tags: [String],
    media: {
        audio: {
            url: String,
            duration: Number,
            fileSize: Number
        },
        video: {
            url: String,
            duration: Number,
            fileSize: Number,
            thumbnail: String
        },
        slides: {
            url: String,
            fileSize: Number
        },
        notes: {
            url: String,
            fileSize: Number
        }
    },
    transcript: {
        type: String
    },
    keyPoints: [String],
    outline: [{
        point: String,
        scripture: String,
        notes: String
    }],
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            required: true
        },
        commentedAt: {
            type: Date,
            default: Date.now
        },
        approved: {
            type: Boolean,
            default: false
        }
    }],
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes
sermonSchema.index({ date: -1 });
sermonSchema.index({ category: 1 });
sermonSchema.index({ featured: 1, status: 1 });
sermonSchema.index({ 'speaker.name': 1 });
sermonSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when status changes to published
sermonSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Add like method
sermonSchema.methods.addLike = function(userId) {
    const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
    if (!existingLike) {
        this.likes.push({ user: userId });
        return this.save();
    }
    return Promise.resolve(this);
};

// Remove like method
sermonSchema.methods.removeLike = function(userId) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    return this.save();
};

module.exports = mongoose.model('Sermon', sermonSchema);
