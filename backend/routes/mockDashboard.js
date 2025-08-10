const express = require('express');
const jwt = require('jsonwebtoken');
const mockDB = require('../mockDatabase');

const router = express.Router();

// Mock auth middleware
const mockAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        
        const user = mockDB.findUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = decoded;
        req.userDoc = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get dashboard stats
router.get('/stats', mockAuth, (req, res) => {
    try {
        const userId = req.user.userId;
        
        const myPrayers = mockDB.findPrayersByUser(userId).length;
        const myEvents = mockDB.findEventsByUser(userId).length;
        const totalPrayers = mockDB.findPublicPrayers().length;
        const upcomingEvents = mockDB.findUpcomingEvents().length;

        const stats = {
            myPrayers,
            myEvents,
            totalPrayers,
            upcomingEvents
        };

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
