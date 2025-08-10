const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ success: true, sermons: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Sermon created' }));

module.exports = router;
