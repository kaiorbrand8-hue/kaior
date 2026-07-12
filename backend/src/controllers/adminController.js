const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// @route GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalCustomers, revenueAgg, pendingOrders, confirmedOrders, pendingReviewsAgg] =
    await Promise.all([
      // Cancelled orders don't count as real orders received.
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Product.countDocuments({}),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: { $in: ['confirmed', 'shipped', 'delivered'] } }),
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
    confirmedOrders,
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

// @route GET /api/admin/stats/charts
const getChartData = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 30, 7), 90);
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const [revenueTrendRaw, statusBreakdownRaw, topProductsRaw] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
    ]),
  ]);

  // Fill in the days with no orders so the trend line has no gaps.
  const revenueByDate = new Map(revenueTrendRaw.map((r) => [r._id, r]));
  const revenueTrend = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const entry = revenueByDate.get(key);
    revenueTrend.push({ date: key, revenue: entry?.revenue || 0, orders: entry?.orders || 0 });
  }

  const statusBreakdown = statusBreakdownRaw.map((s) => ({ status: s._id, count: s.count }));
  const topProducts = topProductsRaw.map((p) => ({
    productId: p._id,
    name: p.name,
    quantitySold: p.quantitySold,
    revenue: p.revenue,
  }));

  res.json({ revenueTrend, statusBreakdown, topProducts });
});

module.exports = { getStats, getUsers, getChartData };
