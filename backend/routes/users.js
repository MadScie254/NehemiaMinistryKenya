const express = require('express');
const router = express.Router();

// Basic routes - implement as needed
router.get('/', (req, res) => res.json({ success: true, users: [] }));
router.get('/sermons', (req, res) => res.json({ success: true, sermons: [] }));
router.get('/blog', (req, res) => res.json({ success: true, posts: [] }));
router.get('/donations', (req, res) => res.json({ success: true, donations: [] }));
router.get('/content', (req, res) => res.json({ success: true, content: [] }));

module.exports = router;
