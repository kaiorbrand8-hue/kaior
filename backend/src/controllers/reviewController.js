const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const recomputeRating = require('../utils/recomputeRating');

// @route GET /api/admin/reviews (admin)
const getAllReviews = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const pipeline = [
    { $unwind: '$reviews' },
    ...(status ? [{ $match: { 'reviews.status': status } }] : []),
    { $sort: { 'reviews.createdAt': -1 } },
    {
      $facet: {
        items: [
          { $skip: (pageNum - 1) * limitNum },
          { $limit: limitNum },
          {
            $project: {
              _id: 0,
              productId: '$_id',
              productName: '$name',
              productSlug: '$slug',
              review: '$reviews',
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await Product.aggregate(pipeline);
  const items = result?.items || [];
  const total = result?.total?.[0]?.count || 0;

  res.json({ items, page: pageNum, pages: Math.ceil(total / limitNum) || 1, total });
});

// @route PUT /api/admin/reviews/:productId/:reviewId (admin)
const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = status;
  recomputeRating(product);
  await product.save();

  res.json({ message: 'Review updated' });
});

// @route DELETE /api/admin/reviews/:productId/:reviewId (admin)
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  product.reviews.pull({ _id: req.params.reviewId });
  recomputeRating(product);
  await product.save();

  res.json({ message: 'Review deleted' });
});

module.exports = { getAllReviews, updateReviewStatus, deleteReview };
