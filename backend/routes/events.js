const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, leaderAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = 'published',
            upcoming = false 
        } = req.query;

        const filter = { status };
        if (category) filter.category = category;
        if (upcoming === 'true') {
            filter['date.start'] = { $gte: new Date() };
        }

        const events = await Event.find(filter)
            .populate('createdBy', 'firstName lastName')
            .sort({ 'date.start': 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Event.countDocuments(filter);

        res.json({
            success: true,
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'firstName lastName')
            .populate('registrations.user', 'firstName lastName email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Leader
router.post('/', leaderAuth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['service', 'conference', 'workshop', 'outreach', 'fellowship', 'youth', 'children', 'special']),
    body('date.start').isISO8601().withMessage('Valid start date is required'),
    body('date.end').isISO8601().withMessage('Valid end date is required'),
    body('location.name').trim().notEmpty().withMessage('Location name is required')
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

        const eventData = {
            ...req.body,
            createdBy: req.user.userId
        };

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (!event.isRegistrationOpen) {
            return res.status(400).json({
                success: false,
                message: 'Registration is closed for this event'
            });
        }

        await event.registerUser(req.user.userId);

        res.json({
            success: true,
            message: 'Successfully registered for event'
        });
    } catch (error) {
        console.error('Register event error:', error);
        if (error.message.includes('already registered') || error.message.includes('full')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/events/:id/attendance
// @desc    Mark attendance for an event
// @access  Leader
router.post('/:id/attendance', leaderAuth, [
    body('userId').isMongoId().withMessage('Valid user ID required')
], async (req, res) => {
    try {
        const { userId } = req.body;
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        await event.markAttendance(userId);

        res.json({
            success: true,
            message: 'Attendance marked successfully'
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/my-events
// @desc    Get user's registered events
// @access  Private
router.get('/my-events', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        const events = await Event.find({ 'registrations.user': userId })
            .populate('createdBy', 'firstName lastName')
            .sort({ 'date.start': -1 });

        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
