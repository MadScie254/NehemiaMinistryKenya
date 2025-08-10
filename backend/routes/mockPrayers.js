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

// Get all public prayers
router.get('/', (req, res) => {
    try {
        const prayers = mockDB.findPublicPrayers().map(prayer => ({
            ...prayer,
            requester: mockDB.findUserById(prayer.requester)
        }));

        res.json({
            success: true,
            prayers
        });
    } catch (error) {
        console.error('Get prayers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prayers'
        });
    }
});

// Get user's prayers
router.get('/my-prayers', mockAuth, (req, res) => {
    try {
        const prayers = mockDB.findPrayersByUser(req.user.userId);

        res.json({
            success: true,
            prayers
        });
    } catch (error) {
        console.error('Get my prayers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your prayers'
        });
    }
});

// Submit new prayer
router.post('/', mockAuth, (req, res) => {
    try {
        const { title, content, category, priority, isPublic } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const newPrayer = mockDB.addPrayer({
            title,
            content,
            category: category || 'general',
            priority: priority || 'medium',
            isPublic: isPublic !== false,
            requester: req.user.userId,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Prayer request submitted successfully',
            prayer: newPrayer
        });
    } catch (error) {
        console.error('Submit prayer error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting prayer request'
        });
    }
});

module.exports = router;
