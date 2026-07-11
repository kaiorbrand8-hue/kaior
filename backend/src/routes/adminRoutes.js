const express = require('express');
const { getStats, getUsers, getChartData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/stats/charts', protect, admin, getChartData);
router.get('/users', protect, admin, getUsers);

module.exports = router;
