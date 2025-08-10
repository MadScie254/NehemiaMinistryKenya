const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ success: true, posts: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Post created' }));

module.exports = router;
