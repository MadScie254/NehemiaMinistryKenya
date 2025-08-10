const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ success: true, donations: [] }));
router.post('/', (req, res) => res.json({ success: true, message: 'Donation processed' }));

module.exports = router;
