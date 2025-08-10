const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['service', 'conference', 'workshop', 'outreach', 'fellowship', 'youth', 'children', 'special'],
        required: true
    },
    date: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    time: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    location: {
        name: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        onlineLink: String
    },
    organizer: {
        name: {
            type: String,
            required: true
        },
        contact: {
            email: String,
            phone: String
        }
    },
    speakers: [{
        name: {
            type: String,
            required: true
        },
        title: String,
        bio: String,
        image: String,
        topic: String
    }],
    capacity: {
        type: Number,
        default: 0
    },
    registrations: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        attended: {
            type: Boolean,
            default: false
        },
        attendedAt: Date,
        notes: String
    }],
    requiresRegistration: {
        type: Boolean,
        default: true
    },
    registrationDeadline: {
        type: Date
    },
    fee: {
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'KES'
        },
        description: String
    },
    images: [String],
    featuredImage: String,
    agenda: [{
        time: String,
        activity: String,
        speaker: String,
        duration: Number
    }],
    resources: [{
        name: String,
        type: {
            type: String,
            enum: ['document', 'audio', 'video', 'link']
        },
        url: String,
        description: String
    }],
    tags: [String],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'yearly']
        },
        endDate: Date
    },
    reminders: [{
        type: {
            type: String,
            enum: ['email', 'sms', 'push']
        },
        daysBefore: Number,
        sent: {
            type: Boolean,
            default: false
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes
eventSchema.index({ 'date.start': 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1, featured: 1 });
eventSchema.index({ tags: 1 });

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function() {
    return this.registrations.length;
});

// Check if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
    if (!this.requiresRegistration) return false;
    if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
    if (this.capacity > 0 && this.registrations.length >= this.capacity) return false;
    return true;
});

// Register user for event
eventSchema.methods.registerUser = function(userId) {
    const existingRegistration = this.registrations.find(reg => reg.user.toString() === userId.toString());
    if (existingRegistration) {
        throw new Error('User already registered for this event');
    }
    
    if (this.capacity > 0 && this.registrations.length >= this.capacity) {
        throw new Error('Event is full');
    }
    
    this.registrations.push({ user: userId });
    return this.save();
};

// Mark attendance
eventSchema.methods.markAttendance = function(userId) {
    const registration = this.registrations.find(reg => reg.user.toString() === userId.toString());
    if (!registration) {
        throw new Error('User not registered for this event');
    }
    
    registration.attended = true;
    registration.attendedAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
