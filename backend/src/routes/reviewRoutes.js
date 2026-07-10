const express = require('express');
const { getAllReviews, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getAllReviews);
router.put('/:productId/:reviewId', protect, admin, updateReviewStatus);
router.delete('/:productId/:reviewId', protect, admin, deleteReview);

module.exports = router;
