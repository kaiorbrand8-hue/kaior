const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

// @route GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { keyword, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (keyword) {
    const regex = new RegExp(escapeRegex(keyword.trim()), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [items, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.json({ items, page: pageNum, pages: Math.ceil(total / limitNum) || 1, total });
});

module.exports = { getStats, getUsers };
