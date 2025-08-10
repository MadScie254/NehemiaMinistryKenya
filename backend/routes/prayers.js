const express = require('express');
const { body, validationResult } = require('express-validator');
const Prayer = require('../models/Prayer');
const { auth, leaderAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/prayers
// @desc    Get all public prayers
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            priority, 
            status = 'approved' 
        } = req.query;

        const filter = { 
            isPublic: true,
            status: status
        };

        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const prayers = await Prayer.find(filter)
            .populate('requester', 'firstName lastName profileImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Prayer.countDocuments(filter);

        res.json({
            success: true,
            prayers,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Get prayers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/prayers
// @desc    Submit a prayer request
// @access  Public/Private
router.post('/', [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Prayer content is required'),
    body('category').optional().isIn(['healing', 'family', 'financial', 'spiritual', 'guidance', 'thanksgiving', 'urgent', 'general']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('isAnonymous').optional().isBoolean(),
    body('anonymousName').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, content, category, priority, isAnonymous, anonymousName, isPublic } = req.body;

        // Check authentication for non-anonymous prayers
        let userId = null;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token && !isAnonymous) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch (err) {
                // Token invalid but continue for anonymous prayers
            }
        }

        if (!isAnonymous && !userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required for non-anonymous prayers'
            });
        }

        const prayer = new Prayer({
            title,
            content,
            category: category || 'general',
            priority: priority || 'medium',
            isAnonymous,
            requester: isAnonymous ? null : userId,
            anonymousName: isAnonymous ? anonymousName : null,
            isPublic: isPublic !== false, // Default to true
            status: 'pending' // Requires approval
        });

        await prayer.save();

        res.status(201).json({
            success: true,
            message: 'Prayer request submitted successfully',
            prayer
        });
    } catch (error) {
        console.error('Submit prayer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/prayers/:id/pray
// @desc    Pray for a prayer request
// @access  Private
router.post('/:id/pray', auth, [
    body('message').optional().trim().isLength({ max: 500 })
], async (req, res) => {
    try {
        const prayer = await Prayer.findById(req.params.id);
        if (!prayer) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        if (!prayer.isPublic || prayer.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: 'Cannot pray for this request'
            });
        }

        const { message } = req.body;
        await prayer.addPrayer(req.user.userId, message);

        res.json({
            success: true,
            message: 'Prayer added successfully',
            prayerCount: prayer.prayerCount
        });
    } catch (error) {
        console.error('Add prayer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/prayers/my-prayers
// @desc    Get user's prayer requests
// @access  Private
router.get('/my-prayers', auth, async (req, res) => {
    try {
        const prayers = await Prayer.find({ requester: req.user.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            prayers
        });
    } catch (error) {
        console.error('Get my prayers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/prayers/:id/approve
// @desc    Approve a prayer request
// @access  Leader
router.put('/:id/approve', leaderAuth, async (req, res) => {
    try {
        const prayer = await Prayer.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approvedBy: req.user.userId,
                approvedAt: new Date()
            },
            { new: true }
        );

        if (!prayer) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        res.json({
            success: true,
            message: 'Prayer request approved',
            prayer
        });
    } catch (error) {
        console.error('Approve prayer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/prayers/:id/answer
// @desc    Add an answer to a prayer request
// @access  Private
router.post('/:id/answer', auth, [
    body('answer').trim().notEmpty().withMessage('Answer is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const prayer = await Prayer.findById(req.params.id);
        if (!prayer) {
            return res.status(404).json({
                success: false,
                message: 'Prayer request not found'
            });
        }

        // Only the requester or leaders can add answers
        if (prayer.requester.toString() !== req.user.userId && 
            !['admin', 'pastor', 'leader'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to answer this prayer'
            });
        }

        const { answer } = req.body;
        prayer.answers.push({
            user: req.user.userId,
            answer
        });

        prayer.status = 'answered';
        await prayer.save();

        res.json({
            success: true,
            message: 'Answer added successfully',
            prayer
        });
    } catch (error) {
        console.error('Add answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
