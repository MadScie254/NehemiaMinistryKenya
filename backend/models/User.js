const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['member', 'admin', 'pastor', 'leader'],
        default: 'member'
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    ministry: {
        type: String,
        enum: ['youth', 'children', 'women', 'men', 'music', 'prayer', 'outreach', 'media', 'finance']
    },
    baptized: {
        type: Boolean,
        default: false
    },
    baptismDate: {
        type: Date
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    profileImage: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        smsNotifications: {
            type: Boolean,
            default: false
        },
        newsletter: {
            type: Boolean,
            default: true
        }
    },
    prayerRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prayer'
    }],
    attendedEvents: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        attendedAt: {
            type: Date,
            default: Date.now
        }
    }],
    donations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }]
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ ministry: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.emailVerificationToken;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
