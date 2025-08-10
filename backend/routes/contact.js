const express = require('express');
const router = express.Router();

// Basic contact route - enhance as needed
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Here you would typically send an email or save to database
        console.log('Contact form submission:', { name, email, subject, message });
        
        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
