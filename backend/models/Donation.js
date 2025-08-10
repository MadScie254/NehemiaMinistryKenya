const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    anonymousDonor: {
        name: String,
        email: String,
        phone: String
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'KES',
        enum: ['KES', 'USD', 'EUR', 'GBP']
    },
    purpose: {
        type: String,
        enum: ['tithe', 'offering', 'building-fund', 'missions', 'youth-ministry', 'children-ministry', 'outreach', 'general', 'special-project'],
        default: 'general'
    },
    customPurpose: {
        type: String
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'bank-transfer', 'card', 'cash', 'cheque'],
        required: true
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    recurringDonation: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'quarterly', 'yearly']
        },
        nextDonationDate: Date,
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    dedicatedTo: {
        type: String
    },
    specialInstructions: {
        type: String
    },
    receiptNumber: {
        type: String,
        unique: true
    },
    receiptSent: {
        type: Boolean,
        default: false
    },
    receiptSentAt: {
        type: Date
    },
    taxDeductible: {
        type: Boolean,
        default: true
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    notes: {
        type: String
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ purpose: 1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ receiptNumber: 1 });
donationSchema.index({ 'recurringDonation.isRecurring': 1, 'recurringDonation.nextDonationDate': 1 });

// Generate receipt number
donationSchema.pre('save', function(next) {
    if (!this.receiptNumber) {
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);
        this.receiptNumber = `NMK-${year}-${timestamp}`;
    }
    next();
});

// Methods
donationSchema.methods.markAsCompleted = function() {
    this.paymentStatus = 'completed';
    this.processedAt = new Date();
    return this.save();
};

donationSchema.methods.sendReceipt = function() {
    this.receiptSent = true;
    this.receiptSentAt = new Date();
    return this.save();
};

// Campaign Schema
const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goal: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'KES'
        }
    },
    raised: {
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'KES'
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    image: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Virtual for progress percentage
campaignSchema.virtual('progressPercentage').get(function() {
    return this.goal.amount > 0 ? Math.round((this.raised.amount / this.goal.amount) * 100) : 0;
});

const Donation = mongoose.model('Donation', donationSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = { Donation, Campaign };
