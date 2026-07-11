const express = require('express');
const { getStats, getUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);

module.exports = router;
