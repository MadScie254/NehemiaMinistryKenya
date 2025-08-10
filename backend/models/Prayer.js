const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['healing', 'family', 'financial', 'spiritual', 'guidance', 'thanksgiving', 'urgent', 'general'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return !this.isAnonymous;
        }
    },
    anonymousName: {
        type: String,
        required: function() {
            return this.isAnonymous;
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'praying', 'answered', 'archived'],
        default: 'pending'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    prayers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        prayedAt: {
            type: Date,
            default: Date.now
        },
        message: String
    }],
    answers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        answer: {
            type: String,
            required: true
        },
        answeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    viewCount: {
        type: Number,
        default: 0
    },
    prayerCount: {
        type: Number,
        default: 0
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    followUpDate: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
prayerSchema.index({ status: 1, isPublic: 1 });
prayerSchema.index({ category: 1 });
prayerSchema.index({ priority: 1 });
prayerSchema.index({ createdAt: -1 });

// Update prayer count when someone prays
prayerSchema.methods.addPrayer = function(userId, message) {
    this.prayers.push({
        user: userId,
        message: message
    });
    this.prayerCount = this.prayers.length;
    return this.save();
};

module.exports = mongoose.model('Prayer', prayerSchema);
