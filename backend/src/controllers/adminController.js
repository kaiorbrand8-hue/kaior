const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @route GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalCustomers, revenueAgg, pendingOrders, pendingReviewsAgg] =
    await Promise.all([
      Order.countDocuments({}),
      Product.countDocuments({}),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Product.aggregate([
        { $unwind: '$reviews' },
        { $match: { 'reviews.status': 'pending' } },
        { $count: 'count' },
      ]),
    ]);

  res.json({
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    pendingReviews: pendingReviewsAgg[0]?.count || 0,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
});

module.exports = { getStats };
