const express = require('express');
const { registerUser, loginUser, getMe, updateMe, addAddress } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/me/addresses', protect, addAddress);

module.exports = router;
