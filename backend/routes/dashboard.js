const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Prayer = require('../models/Prayer');
const Event = require('../models/Event');
const Sermon = require('../models/Sermon');
const { Donation } = require('../models/Donation');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = {};

        if (['admin', 'pastor', 'leader'].includes(req.user.role)) {
            stats.totalUsers = await User.countDocuments({ isActive: true });
            stats.totalPrayers = await Prayer.countDocuments();
            stats.pendingPrayers = await Prayer.countDocuments({ status: 'pending' });
            stats.totalEvents = await Event.countDocuments();
            stats.upcomingEvents = await Event.countDocuments({ 
                'date.start': { $gte: new Date() },
                status: 'published'
            });
            stats.totalSermons = await Sermon.countDocuments({ status: 'published' });
            stats.totalDonations = await Donation.aggregate([
                { $match: { paymentStatus: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            stats.recentUsers = await User.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('firstName lastName email createdAt');
        } else {
            // Member dashboard stats
            stats.myPrayers = await Prayer.countDocuments({ requester: req.user.userId });
            stats.myEvents = await Event.countDocuments({ 
                'registrations.user': req.user.userId 
            });
        }

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
