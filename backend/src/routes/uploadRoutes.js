const express = require('express');
const { uploadImages } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.array('images', 8), uploadImages);

module.exports = router;
